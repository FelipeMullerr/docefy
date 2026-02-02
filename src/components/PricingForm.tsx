import React from "react";

type Product = {
  id: string;
  name: string;
  type: string;
  unit: string;
  user_id: string;
  product_price?: number;
};

type PricingItem = {
  product_id: string;
  amount: number;
  unit: string;
  unit_price: number;
  total_price: number;
};
// Definiçao dos props obrigatorios que o PricingForm deve receber como parametro
interface PricingFormProps {
  products: Product[];
  items: PricingItem[];
  pricingName: string;
  setPricingName: (name: string) => void;
  laborCost: number;
  setLaborCost: (n: number) => void;
  extraCost: number;
  setExtraCost: (n: number) => void;
  profitMargin: number;
  setProfitMargin: (n: number) => void;
  suggestedPrice: number;
  loading: boolean;
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  editingPricingId: string | null;
  addItem: () => void;
  updateItem: (
    idx: number,
    field: keyof PricingItem,
    value: string | number,
  ) => void;
  setProductForItem: (idx: number, productId: string) => void;
  removeItem: (idx: number) => void;
  savePricing: (e: React.FormEvent) => void;
}

function PricingForm(props: PricingFormProps) {
  if (!props.formOpen) return null;
  const {
    products,
    items,
    pricingName,
    setPricingName,
    laborCost,
    setLaborCost,
    extraCost,
    setExtraCost,
    profitMargin,
    setProfitMargin,
    suggestedPrice,
    loading,
    setFormOpen,
    editingPricingId,
    addItem,
    updateItem,
    removeItem,
    savePricing,
  } = props;

  return (
    <form onSubmit={savePricing} className="flex flex-col gap-4 mb-8 w-full">
      <h2 className="text-2xl font-extrabold mb-2 text-[#3d2c1e] tracking-tight">
        {editingPricingId
          ? "Visualizar/Editar Precificação"
          : "Nova Precificação"}
      </h2>
      <label className="text-black font-semibold mb-1" htmlFor="pricing-name">
        Nome da precificação
      </label>
      <input
        id="pricing-name"
        type="text"
        placeholder="Nome da precificação"
        className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full text-black placeholder-black"
        value={pricingName}
        onChange={(e) => setPricingName(e.target.value)}
        required
      />

        {/* coloca os itens que ja estao cadastrados em um dropbox */}
        {items.map((item, idx) => (
          <div
            key={idx}
            className="border border-[#3d2c1e] rounded-lg p-4 space-y-2 bg-[#f7f3ef]/40"
          >
            <label
              className="text-black font-semibold mb-1"
              htmlFor={`product-${idx}`}
            >
              Nome do produto
            </label>
            <select
              id={`product-${idx}`}
              className="border border-[#3d2c1e] rounded-lg px-4 py-2 w-full bg-white text-black"
              value={item.product_id}
              onChange={(e) => {
                const productId = e.target.value;
                props.setProductForItem(idx, productId);
              }}
            >
              <option value="">Selecione o produto</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  className="text-black font-semibold mb-1"
                  htmlFor={`amount-${idx}`}
                >
                  Quantidade ({item.unit})
                </label>
                <input
                  id={`amount-${idx}`}
                  type="number"
                  placeholder="Quantidade usada"
                  className="border border-[#3d2c1e] rounded-lg px-4 py-2 w-full text-black"
                  value={
                    item.amount === 0
                      ? ""
                      : typeof item.amount === "number"
                        ? item.amount.toString()
                        : item.amount
                  }
                  inputMode="decimal"
                  step="any"
                  min="0"
                  onChange={(e) => {
                    const val = e.target.value;
                    updateItem(
                      idx,
                      "amount",
                      val === "" ? 0 : parseFloat(val.replace(",", ".")),
                    );
                  }}
                />
              </div>
              <div className="flex-1">
                <label
                  className="text-black font-semibold mb-1"
                  htmlFor={`unit-price-${idx}`}
                >
                  Valor unitário
                </label>
                <input
                  id={`unit-price-${idx}`}
                  type="text"
                  placeholder="Preço por unidade"
                  className="border border-[#3d2c1e] rounded-lg px-4 py-2 w-full text-black bg-gray-100"
                  value={item.unit_price === 0 ? "" : `R$ ${item.unit_price}`}
                  inputMode="decimal"
                  step="any"
                  readOnly
                  disabled
                />
              </div>
            </div>
            <p className="text-black text-sm">
              {item.amount} {item.unit} × R$ {item.unit_price.toFixed(2)} =
              <strong> R$ {item.total_price.toFixed(2)}</strong>
            </p>
            <button
              type="button"
              className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 transition"
              onClick={() => removeItem(idx)}
            >
              Remover item
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="bg-[#f7f3ef] text-black px-4 py-2 rounded-lg shadow font-semibold border border-[#3d2c1e] w-fit"
        >
          Adicionar Item
        </button>

        <div>
          <label className="text-black font-semibold mb-1" htmlFor="labor-cost">
            Valor mão de obra
          </label>
          <input
            id="labor-cost"
            type="number"
            placeholder="Custo de mão de obra"
            className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full text-black"
            value={laborCost === 0 ? "" : laborCost}
            inputMode="decimal"
            step="any"
            onChange={(e) => {
              const val = e.target.value.replace(/^0+(?=\d)/, "");
              setLaborCost(val === "" ? 0 : parseFloat(val.replace(",", ".")));
            }}
          />
        </div>

        <div>
          <label className="text-black font-semibold mb-1" htmlFor="extra-cost">
            Custos extras
          </label>
          <input
            id="extra-cost"
            type="number"
            placeholder="Custos extras (luz, gás,etc)"
            className="border border-[#3d2c1e] rounded-lg px-4 py-3 w-full text-black"
            value={extraCost === 0 ? "" : extraCost}
            inputMode="decimal"
            step="any"
            onChange={(e) => {
              const val = e.target.value.replace(/^0+(?=\d)/, "");
              setExtraCost(val === "" ? 0 : parseFloat(val.replace(",", ".")));
            }}
          />
        </div>

        {/* barra seletora da margem de lucro */}
        <div className="flex flex-col gap-2">
          <label className="text-black font-semibold">
            Margem de Lucro: {profitMargin}%
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={profitMargin}
            onChange={(e) => setProfitMargin(Number(e.target.value))}
            className="w-full accent-[#3d2c1e]"
          />
        </div>

        <p className="text-black font-bold">
          Preço sugerido: R$ {suggestedPrice.toFixed(2)}
        </p>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#f7f3ef] text-black px-6 py-3 rounded-lg shadow font-semibold border border-[#3d2c1e]"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button
            type="button"
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold"
            onClick={() => setFormOpen(false)}
          >
            Cancelar
          </button>
        </div>
    </form>
  );
}

export default PricingForm;
