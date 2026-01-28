type Pricing = {
  id: string;
  name: string;
  created_at: string;
  suggested_price: number;
};

interface PricingListProps {
  pricings: Pricing[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

function PricingList(props: PricingListProps) {
  const { pricings, loading, onEdit, onDelete } = props;

  return (
    <div className="w-full mt-10">
      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Carregando...
        </div>
      ) : pricings.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          Nenhuma precificação cadastrada.
        </div>
      ) : (
        pricings.map((p) => (
          <div
            key={p.id}
            className="bg-[#f7f3ef] p-4 rounded-xl shadow mb-2 flex justify-between items-center"
          >
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-black">{p.name}</strong>
                <span className="text-xs text-gray-500">
                  {p.created_at
                    ? new Date(p.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <p className="text-black">
                R$ {p.suggested_price.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 rounded-md bg-[#f7f3ef] border border-[#3d2c1e] text-black text-xs hover:bg-[#e5e0db] transition"
                onClick={() => onEdit(p.id)}
              >
                Ver/Editar
              </button>
              <button
                className="px-3 py-1.5 rounded-md bg-red-500 text-white text-xs hover:bg-red-600 transition"
                onClick={() => onDelete(p.id)}
              >
                Excluir
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PricingList;
