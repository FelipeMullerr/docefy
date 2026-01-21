import Navbar from "../components/navbar";

function Home() {
  return (
    <div className="min-h-screen bg-[#f7f3ef]">
      <Navbar buttonText="Entrar" buttonTo="/login" />
      <section className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl shadow-lg mx-auto mt-10 p-8 max-w-6xl">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3d2c1e] mb-4">
            Sua confeitaria lucrativa começa com o preço certo
          </h1>
          <p className="text-[#6c5c4c] mb-6">
            Transforme suas receitas em lucro real. O Docefy automatiza seus
            cálculos de custos, insumos e margem de lucro em segundos.
          </p>
          <button className="bg-[#c97a5b] text-white px-6 py-3 rounded-lg shadow hover:bg-[#b86a4c] font-semibold">
            Calcular meu receita
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
