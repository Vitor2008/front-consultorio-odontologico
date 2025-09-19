

export async function realizarLogin(email: string, senha: string) {
    try {
        if (email === 'teste@gmail.com' && senha === '123456') {
            return {
                status: 'success',
                message: 'Login realizado com sucesso!',
                data: null
            };
        }
        return {
            status: 'error',
            message: 'Usuário ou senha incorretos.',
            data: null
        };

    } catch (error) {
        return {
            status: 'error',
            message: `Erro ao realizar login - ${error}`,
            data: null
        };
    }
};

export async function cadastrarUsuario(nome: string, email: string, telefone: string,
    cpf: string, data_nascimento: string, senha_hash: string) {
    try {

        console.log(nome, email, telefone, cpf, data_nascimento, senha_hash);

        return {
            status: 'error',
            message: 'Cadastro realizado com sucesso!',
            data: null
        };

    } catch (error) {
        return {
            status: 'error',
            message: `Erro ao cadastrar usuário - ${error}`,
            data: null
        };
    }
};