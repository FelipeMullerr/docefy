import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar";

export default function Register() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  // Requisitos da senha
  const requisitos = [
    { label: "Pelo menos 8 caracteres", check: (s: string) => s.length >= 8 },
    {
      label: "Pelo menos uma letra maiúscula",
      check: (s: string) => /[A-Z]/.test(s),
    },
    {
      label: "Pelo menos uma letra minúscula",
      check: (s: string) => /[a-z]/.test(s),
    },
    { label: "Pelo menos um número", check: (s: string) => /\d/.test(s) },
  ];

  const supabaseRegisterErrorMap: Record<string, string> = {
    "User already registered": "Este e-mail já está cadastrado.",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
    "Email not confirmed": "E-mail não confirmado. Verifique sua caixa de entrada.",
    "Invalid email format": "Formato de e-mail inválido.",
    "Signup requires a valid password": "Informe uma senha válida.",
  };
  
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro(null);
    setSucesso(null);

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });

    if (error) {
      const mensagem = supabaseRegisterErrorMap[error.message] || "Ocorreu um erro: " + error.message;
      setErro(mensagem);
      setLoading(false);
      return;
    }

    setSucesso(
      "Cadastro realizado! Verifique seu e-mail para confirmar o cadastro.",
    );
    setLoading(false);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar buttonText="Voltar para Home" buttonTo="/" />
      <div className="flex-1 flex items-center justify-center bg-linear-to-br from-[#f7f3ef]">
        <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center">
          <h2 className="text-3xl font-extrabold mb-8 text-[#3d2c1e] tracking-tight">
            Cadastre-se no Docefy
          </h2>
          <form
            onSubmit={handleRegister}
            className="flex flex-col gap-5 w-full"
          >
            <input
              type="email"
              placeholder="E-mail"
              className="border border-[#3d2c1e] rounded-lg px-4 py-3 focus:outline-none transition-colors placeholder-black text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {/* Campo de Senha com validadores */}
            <div className="w-full relative">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                className="w-full border border-[#3d2c1e] rounded-lg px-4 py-3 pr-12 focus:outline-none transition-colors placeholder-black text-black"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              {/* Exibir e Ocultar Senha */}
              <img
                src={mostrarSenha ? "/icons/hiddeneye.png" : "/icons/eye.png"}
                alt="Mostrar senha"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              />
            </div>
            {/* Validadores do Regex */}
            <div className="flex flex-col gap-2 mt-2 mb-4">
              {requisitos.map((req, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span>
                    {req.check(senha) ? (
                      <img src="/icons/check.png" className="h-4 w-4"></img>
                    ) : (
                      <img src="/icons/close.png" className="h-4 w-4"></img>
                    )}
                  </span>
                  <span
                    className={
                      req.check(senha) ? "text-green-600" : "text-red-600"
                    }
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>

            {erro && (
              <div className="text-red-600 text-sm text-center">{erro}</div>
            )}
            {sucesso && (
              <div className="text-green-600 text-sm text-center">
                {sucesso}
              </div>
            )}
            <button
              type="submit"
              className="bg-[#f7f3ef] hover:bg-[#f7f3ef] text-black py-3 rounded-lg font-bold shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
          <div className="mt-6 w-full flex flex-col items-center">
            <span className="text-[#6c5c4c] text-sm mb-2">Já tem conta?</span>
            <Link
              to="/login"
              className="inline-block border border-[#f7f3ef] text-black hover:bg-[#f7f3ef] font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-sm"
            >
              Entrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
