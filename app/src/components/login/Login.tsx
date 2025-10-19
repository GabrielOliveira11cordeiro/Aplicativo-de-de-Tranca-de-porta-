import { loginUser } from '@/app/services/LoginService';
import { useRouter } from 'expo-router';
import { useState } from 'react';
export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const router = useRouter();
  const handleLogin = async () => {
    setStatusMessage(null);

    if (email.trim() === '' || password.trim() === '') {
      setStatusMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const accessLevel = await loginUser(email, password);
      if (accessLevel === 'admin') {
        router.push('./admin/AdminHome');
      } else if (accessLevel === 'user') {
        router.push('./user/UserHome');
      } else {
        setStatusMessage('Nível de acesso desconhecido. Contate o administrador.');
      }

    } catch (error: any) {
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'O e-mail fornecido é inválido.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Não há usuário com este e-mail.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'A senha está incorreta.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas de login. Sua conta foi temporariamente bloqueada.';
          break;
        default:
          errorMessage = error.message;
          break;
      }
      setStatusMessage(`Erro: ${errorMessage}`);
    }
  };
// Aqui fica codigo da tela de login
}

