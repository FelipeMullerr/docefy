import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [profileName, setProfileName] = useState("");
  const [showProfileName, setShowProfileName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const navigate = useNavigate();
  const [mostrarSenha, setMostrarSenha] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      setLoading(false);
      return;
    }

    // Verifica se já existe perfil
    const user = data.user;
    if (user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (profileError && profileError.code !== "PGRST116") {
        setErro(profileError.message);
        setLoading(false);
        return;
      }
      console.log("User ID:", user.id);
      console.log("Profile data:", profile);
      console.log("Profile error:", profileError);
      if (!profile) {
        // Não existe perfil, pede o nome de perfil
        setShowProfileName(true);
        setLoading(false);
        return;
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  }

  async function handleCreateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: user.id, name: profileName }]);
      if (profileError) {
        setErro(profileError.message);
        setLoading(false);
        return;
      }
      navigate("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar buttonText="Voltar para Home" buttonTo="/" />
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-[#f7f3ef]">
        <div className="bg-white rounded-2xl shadow-2x1 p-10 w-full max-w-md flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-8 text-[#3d2c1e] tracking-tight">
            Entrar no Docefy
          </h2>
          {/*Formulário para escolha do nome de usuário no primeiro login no sistema */}
          {!showProfileName ? (
            <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
              <input
                type="email"
                placeholder="E-mail"
                className="border border-[#3d2c1e] rounded-lg px-4 py-3 focus:outline-none transition-colors placeholder-black text-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="w-full relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Senha"
                  className="w-full border border-[#3d2c1e] rounded-lg px-4 py-3 pr-12 focus:outline-none transition-colors placeholder-black text-black"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <img
                  src={mostrarSenha ? "/icons/hiddeneye.png" : "/icons/eye.png"}
                  alt="Mostrar senha"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                />
              </div>
              {erro && (
                <div className="text-red-600 text-sm text-center">{erro}</div>
              )}
              <button
                type="submit"
                className="bg-[#f7f3ef] hover:bg-[#f7f3ef] text-black py-3 rounded-lg font-bold shadow-md transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleCreateProfile}
              className="flex flex-col gap-5 w-full"
            >
              <input
                type="text"
                placeholder="Escolha seu nome de perfil"
                className="border border-[#3d2c1e] rounded-lg px-4 py-3 focus:outline-none transition-colors placeholder-black text-black"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                required
              />
              {erro && (
                <div className="text-red-600 text-sm text-center">{erro}</div>
              )}
              <button
                type="submit"
                className="bg-[#c97a5b] hover:bg-[#b86a4c] text-white py-3 rounded-lg font-bold shadow-md transition-all duration-200"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar perfil"}
              </button>
            </form>
          )}
          <div className="mt-6 w-full flex flex-col items-center">
            <span className="text-[#6c5c4c] text-sm mb-2">
              Ainda não tem conta?
            </span>
            <Link
              to="/register"
              className="inline-block border border-[#f7f3ef] text-black hover:bg-[#f7f3ef] font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-sm "
            >
              {" "}
              Cadastre-se{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
