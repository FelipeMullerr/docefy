import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/navbar";

type Product = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  unit: string;
  product_price?: number;
  created_at?: string;
};

const TYPE_OPTIONS = ["Ingrediente", "Embalagem"];

const UNIDADES = ["Kg", "g", "Caixa", "ml", "Litro", "Unidade"];

function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Estados para cadastro/edição
  const [formOpen, setFormOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Campos do formulário
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [priceError, setPriceError] = useState<string>("");

  // Pesquisa
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return;
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      setProducts((data as Product[]) || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  function handleOpenForm(product: Product | null = null) {
    setEditProduct(product);
    setName(product?.name || "");
    setType(product?.type || "");
    setUnit(product?.unit || "");
    setPrice(product?.product_price ?? "");
    setPriceError("");
    setFormOpen(true);
  }

  function handleCloseForm() {
    setEditProduct(null);
    setName("");
    setType("");
    setUnit("");
    setPrice("");
    setPriceError("");
    setFormOpen(false);
  }

  async function handleSaveProduct(e: React.FormEvent) {
    e.preventDefault();
    setPriceError("");
    if (price === "" || isNaN(Number(price)) || Number(price) <= 0) {
      setPriceError("O preço deve ser maior que zero.");
      return;
    }
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return;

    if (editProduct) {
      await supabase
        .from("products")
        .update({ name, type, unit, product_price: Number(price) })
        .eq("id", editProduct.id);
    } else {
      await supabase
        .from("products")
        .insert([
          { user_id: userId, name, type, unit, product_price: Number(price) },
        ]);
    }
    handleCloseForm();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  async function handleDeleteProduct(id: string) {
    setLoading(true);
    await supabase.from("products").delete().eq("id", id);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setProducts((data as Product[]) || []);
    setLoading(false);
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.unit.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f3ef]">
      <Navbar buttonText="Voltar para Dashboard" buttonTo="/Dashboard" />
      <div className="flex-1 flex flex-col items-center pt-10">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-2xl flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-8 text-[#3d2c1e] tracking-tight">
            Produtos
          </h2>
          <div className="w-full flex flex-col md:flex-row gap-4 mb-6 items-center">
            <input
              type="text"
              placeholder="Pesquisar produto..."
              className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full md:w-2/3 focus:outline-none transition-colors placeholder-black text-black"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-[#f7f3ef] text-black px-6 py-3 rounded-lg shadow font-semibold"
              onClick={() => handleOpenForm()}
            >
              Cadastrar Produto
            </button>
          </div>

          {/* Formulário de cadastro/edição */}
          {formOpen && (
            <div className="w-full border border-[#3d2c1e] rounded-lg p-4 space-y-2 bg-[#f7f3ef]/40">
              <form
                onSubmit={handleSaveProduct}
                className="flex flex-col gap-4 mb-8 w-full"
              >
                <h2 className="text-2xl font-extrabold mb-2 text-[#3d2c1e] tracking-tight">
                  Cadastrar Produto
                </h2>
                <label
                  className="text-black font-semibold"
                >
                  Nome Produto
                </label>
                <input
                  id="nome-produto"
                  type="text"
                  placeholder="Nome do produto"
                  className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full text-black placeholder-black"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                
                <label
                  className="text-black font-semibold"
                >
                  Tipo de Produto
                </label>
                <select
                  className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full bg-white text-black"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option value="">Selecione o tipo</option>
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
                
                <label
                  className="text-black font-semibold"
                >
                  Unidade
                </label>
                <select
                  className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full bg-white text-black"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                >
                  <option value="">Selecione a Unidade</option>
                  {UNIDADES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
                
                <label
                  className="text-black font-semibold"
                >
                  Preço
                </label>
                <input
                  type="number"
                  placeholder="Preço do produto"
                  className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full text-black placeholder-black"
                  value={price === "" ? "" : price}
                  min={0.01}
                  step="any"
                  onChange={(e) =>
                    setPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  required
                />
                {priceError && (
                  <span className="text-red-500">{priceError}</span>
                )}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-[#f7f3ef] text-black px-4 py-2 rounded-lg font-semibold"
                    disabled={loading}
                  >
                    {loading
                      ? "Salvando..."
                      : editProduct
                        ? "Salvar Alterações"
                        : "Cadastrar"}
                  </button>
                  <button
                    type="button"
                    className="bg-black text-white px-4 py-2 rounded-lg font-semibold"
                    onClick={handleCloseForm}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <h2 className="text-2xl font-extrabold mb-2 mt-6 text-[#3d2c1e] tracking-tight">
            Produtos Cadastrados
          </h2>
          {/* Lista de produtos */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-black border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-600">
                  <th className="py-3 px-3 font-medium text-center">Nome</th>
                  <th className="py-3 px-3 font-medium text-center">Tipo</th>
                  <th className="py-3 px-3 font-medium text-center">Unidade</th>
                  <th className="py-3 px-3 font-medium text-center">Preço</th>
                  <th className="py-3 px-3 font-medium text-center">Ações</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      Carregando...
                    </td>
                  </tr>
                ) : filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-gray-500">
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b border-gray-100 hover:bg-[#f7f3ef]/40 transition"
                    >
                      <td className="py-3 px-3 text-center">{p.name}</td>
                      <td className="py-3 px-3 text-center">{p.type}</td>
                      <td className="py-3 px-3 text-center">{p.unit}</td>
                      <td className="py-3 px-3 text-center">
                        {p.product_price !== undefined
                          ? `R$ ${Number(p.product_price).toFixed(2)}`
                          : "-"}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenForm(p)}
                            className="px-3 py-1.5 rounded-md bg-[#f7f3ef] text-black text-xs hover:opacity-80 transition"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
