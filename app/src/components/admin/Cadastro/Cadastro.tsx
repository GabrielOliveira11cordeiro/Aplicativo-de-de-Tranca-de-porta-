import { validaCPF } from '@/app/src/utils/Validar';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { registerUserByadmin } from '../../../../services/Service';


export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [idade, setIdade] = useState('');
  const [accessLevel, setAccessLevel] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleRegister = async () => {
    if (!nome.trim() || !cpf.trim() || !idade.trim() || !accessLevel.trim() || !email.trim() || !password.trim()) {
      setStatusMessage('Por favor, preencha todos os campos.');
      return;
    }
    if (!validaCPF(cpf)) {
      setStatusMessage('CPF inválido. Por favor, insira um CPF válido.');
      return;
    }  
    const accessLevelNum = parseInt(accessLevel); 
    if (isNaN(accessLevelNum) || accessLevelNum < 1 || accessLevelNum > 3) {   
      setStatusMessage('Nível de acesso inválido. Insira um número entre 1 e 3.');
      return;
    }
    try {
        const userData = {
            email: email,
            password: password,
            name: nome,
            cpf: cpf,
            idade: parseInt(idade),
            accessLevel: accessLevelNum
        };
      await registerUserByadmin(userData);
      setStatusMessage('Usuário registrado com sucesso!');
      setNome('');
      setCpf('');
      setIdade('');
      setAccessLevel('');
      setEmail('');
      setPassword('');
      router.push('/src/components/login/Login');
    } catch (error: any) {
      setStatusMessage(`Erro: ${error.message}`);
    }
  };
  // aqui fica o codigo da tela de cadastro
}
