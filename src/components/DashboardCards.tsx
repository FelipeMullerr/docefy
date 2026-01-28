interface DashboardCardsProps {
  total: number;
  media: number;
  ultima: string;
}

const DashboardCards = ({ total, media, ultima }: DashboardCardsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full">
    <div className="bg-[#f7f3ef] p-6 rounded-xl shadow text-center">
      <p className="text-black text-sm">Total de Precificações</p>
      <p className="text-3xl font-bold text-black">{total}</p>
    </div>
    <div className="bg-[#f7f3ef] p-6 rounded-xl shadow text-center">
      <p className="text-black text-sm">Média de Preço</p>
      <p className="text-3xl font-bold text-black">
        R$ {media.toFixed(2)}
      </p>
    </div>
    <div className="bg-[#f7f3ef] p-6 rounded-xl shadow text-center">
      <p className="text-black text-sm">Última Precificação</p>
      <p className="text-xl font-bold text-black">{ultima}</p>
    </div>
  </div>
);

export default DashboardCards;