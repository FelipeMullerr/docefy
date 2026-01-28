import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import PricingForm from "../components/PricingForm";
import DashboardCards from "../components/DashboardCards";
import PricingList from "../components/PricingList";

type Product = {
  id: string;
  name: string;
  type: string;
  unit: string;
  user_id: string;
};

type Pricing = {
  id: string;
  name: string;
  created_at: string;
  suggested_price: number;
};

type PricingItem = {
  product_id: string;
  amount: number;
  unit: string;
  unit_price: number;
  total_price: number;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [pricings, setPricings] = useState<Pricing[]>([]);
  const [filteredPricings, setFilteredPricings] = useState<Pricing[]>([]);

  const [items, setItems] = useState<PricingItem[]>([]);
  const [pricingName, setPricingName] = useState("");
  const [laborCost, setLaborCost] = useState(0);
  const [extraCost, setExtraCost] = useState(0);
  const [profitMargin, setProfitMargin] = useState(30);

  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [editingPricingId, setEditingPricingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: prod } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userData.user.id);

      const { data: price } = await supabase
        .from("pricing")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      setProducts(prod || []);
      setPricings(price || []);
      setFilteredPricings(price || []);
      setLoading(false);
    }

    loadData();
  }, []);

  // Função para carregar uma precificação existente para edição
  async function handleEditPricing(pricingId: string) {
    setLoading(true);
    setFormOpen(true);
    setEditingPricingId(pricingId);

    // Busca a precificação
    const { data: pricing } = await supabase
      .from("pricing")
      .select("*")
      .eq("id", pricingId)
      .single();

    // Busca os itens da precificação
    const { data: pricingItems } = await supabase
      .from("pricing_itens")
      .select("*")
      .eq("pricing_id", pricingId);

    setPricingName(pricing?.name || "");
    setLaborCost(pricing?.labor_cost || 0);
    setExtraCost(pricing?.extra_cost || 0);
    setProfitMargin(pricing?.profit_margin || 30);

    setItems(
      (pricingItems || []).map((item: any) => ({
        product_id: item.product_id,
        amount: parseFloat(item.amount),
        unit: item.unit,
        unit_price: item.unit_price ? parseFloat(item.unit_price) : 0,
        total_price: item.total_price ? parseFloat(item.total_price) : 0,
      })),
    );
    setLoading(false);
  }

  // Função para excluir precificação e seus itens
  async function handleDeletePricing(pricingId: string) {
    setLoading(true);
    // Remove os itens da precificacao da tabela pricing_itens no banco
    await supabase.from("pricing_itens").delete().eq("pricing_id", pricingId);
    // Remove a precificação
    await supabase.from("pricing").delete().eq("id", pricingId);

    const { data: userData } = await supabase.auth.getUser();
    const { data: price } = await supabase
      .from("pricing")
      .select("*")
      .eq("user_id", userData.user?.id)
      .order("created_at", { ascending: false });
    setPricings(price || []);
    setFilteredPricings(price || []);
    setLoading(false);
  }

  useEffect(() => {
    setFilteredPricings(
      pricings.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    );
  }, [search, pricings]);

  function getUnit(productId: string) {
    return products.find((p) => p.id === productId)?.unit || "";
  }

  function addItem() {
    setItems([
      ...items,
      { product_id: "", amount: 0, unit: "", unit_price: 0, total_price: 0 },
    ]);
  }

  function updateItem(index: number, field: keyof PricingItem, value: any) {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const { amount, unit_price } = newItems[index];
    newItems[index].total_price =
      amount > 0 && unit_price > 0 ? amount * unit_price : 0;

    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  async function savePricing(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

    if (editingPricingId) {
      // Atualizar precificação existente
      await supabase
        .from("pricing")
        .update({
          name: pricingName,
          labor_cost: laborCost,
          extra_cost: extraCost,
          suggested_price: suggestedPrice,
          profit_margin: profitMargin,
        })
        .eq("id", editingPricingId);

      // Remove todos os itens antigos e insere os novos
      await supabase
        .from("pricing_itens")
        .delete()
        .eq("pricing_id", editingPricingId);

      for (const item of items) {
        await supabase.from("pricing_itens").insert([
          {
            pricing_id: editingPricingId,
            product_id: item.product_id,
            amount: item.amount,
            unit: item.unit,
            total_price: item.total_price,
          },
        ]);
      }
    } else {
      // Nova precificação
      const { data: pricing } = await supabase
        .from("pricing")
        .insert([
          {
            user_id: userData.user.id,
            name: pricingName,
            labor_cost: laborCost,
            extra_cost: extraCost,
            suggested_price: suggestedPrice,
            profit_margin: profitMargin,
          },
        ])
        .select()
        .single();

      for (const item of items) {
        await supabase.from("pricing_itens").insert([
          {
            pricing_id: pricing.id,
            product_id: item.product_id,
            amount: item.amount,
            unit: item.unit,
            total_price: item.total_price,
          },
        ]);
      }
    }

    setFormOpen(false);
    setEditingPricingId(null);
    setItems([]);
    setPricingName("");
    setLoading(false);
  }

  const media =
    pricings.reduce((acc, p) => acc + (p.suggested_price || 0), 0) / (pricings.length || 1);

  {/* Percorre por todos os itens da precificacao somando o seu preco total, desta forma ja se tem o valor calculado */}
  const itemsTotal = items.reduce((acc, cur) => acc + cur.total_price, 0);
  const totalCost = itemsTotal + Number(laborCost) + Number(extraCost);
  const suggestedPrice = totalCost * (1 + profitMargin / 100);

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f3ef]">
      <Navbar buttonText="Sair" buttonTo="/login" />

      <div className="flex-1 flex flex-col items-center pt-10">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-5xl flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-8 text-[#3d2c1e] tracking-tight">
            Dashboard
          </h2>
          {/* Cards Informativos */}
          <DashboardCards
            total={pricings.length}
            media={media}
            ultima={
              pricings[0]
                ? new Date(pricings[0].created_at).toLocaleDateString()
                : "-"
            }
          />
          <button
            className="mb-8 bg-[#f7f3ef] text-black px-6 py-3 rounded-lg shadow font-semibold border border-[#3d2c1e] w-full"
            onClick={() => navigate("/produtos")}
          >
            Ir para Produtos
          </button>

          {/* Botoes e Seccoes para utilizacao do Dashboard */}
          <div className="w-full flex flex-col md:flex-row gap-4 mb-6 items-center">
            <div className="flex-1 w-full">
              <label
                className="block text-black font-semibold mb-1"
                htmlFor="search-pricing"
              >
                Buscar precificação
              </label>
              <input
                id="search-pricing"
                type="text"
                placeholder="Buscar precificação..."
                className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full focus:outline-none transition-colors placeholder-black text-black"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="bg-[#f7f3ef] text-black px-6 py-3 rounded-lg shadow font-semibold border border-[#3d2c1e] mt-4 md:mt-6 md:w-auto w-full md:self-end"
              style={{ minWidth: "200px" }}
              onClick={() => {
                setFormOpen(true);
                setEditingPricingId(null);
                setPricingName("");
                setLaborCost(0);
                setExtraCost(0);
                setProfitMargin(30);
                setItems([]);
              }}
            >
              Nova Precificação
            </button>
          </div>

          {/* Formulario de Preenchimento e Ediçao de Precificacoes */}
          <PricingForm
            products={products}
            items={items}
            setItems={setItems}
            pricingName={pricingName}
            setPricingName={setPricingName}
            laborCost={laborCost}
            setLaborCost={setLaborCost}
            extraCost={extraCost}
            setExtraCost={setExtraCost}
            profitMargin={profitMargin}
            setProfitMargin={setProfitMargin}
            suggestedPrice={suggestedPrice}
            loading={loading}
            formOpen={formOpen}
            setFormOpen={setFormOpen}
            editingPricingId={editingPricingId}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            savePricing={savePricing}
            getUnit={getUnit}
          />

          {/* Lista de precificacoes */}
          <PricingList
            pricings={filteredPricings}
            loading={loading}
            onEdit={handleEditPricing}
            onDelete={handleDeletePricing}
          />
        </div>
      </div>
    </div>
  );
}