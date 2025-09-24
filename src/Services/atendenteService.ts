/* eslint-disable @typescript-eslint/no-explicit-any */
// import bcrypt from 'bcrypt';
import * as bcrypt from 'bcrypt';
import atendenteRepository from '../repositories/atendenteRepository';
import type { CadastroAtendentePayload } from '../models/Login';

class AtendenteService {
  async cadastrar(payload: CadastroAtendentePayload) {
    const { email_login, cpf, senha_plana, nome_completo, data_nascimento, telefone } = payload;
    // const emailExistente = await atendenteRepository.findByEmail(email_login);
    // if (emailExistente) {
    //   throw new Error("Este e-mail já está em uso.");
    // }
    
    // const cpfExistente = await atendenteRepository.findByCpf(cpf);
    // if (cpfExistente) {
      //   throw new Error("Este CPF já está cadastrado.");
      // }
    
    const senha_hash = await bcrypt.hash(senha_plana, 10);
      try {
          const novoAtendente = await atendenteRepository.create({
            nome_completo: nome_completo,
            email_login: email_login,
            data_nascimento: data_nascimento,
            cpf: cpf,
            telefone: telefone,
            senha_hash: senha_hash,
        });
          return novoAtendente;
      } catch (error: any) {
        console.log({ error: error });
      }
  }
}

export default new AtendenteService();