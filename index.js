const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORTA;
const app = express();

//aplicacao use express como json(javascript object notation)
app.use(express.json());

const bancoDados = [];

app.get('/equipamentos', (requisicao, resposta) => {
    //tratamento de excessoes
    try {
      if (bancoDados.length === 0) {
        return resposta.status(200).json({ mensagem: "banco de dados vazio" })
      }
      resposta.status(200).json(bancoDados);
  
    } catch (error) {
      resposta.status(500).json({ mensagem: "erro ao buscar Equipamentos", erro: erro.message })
  
    }
  });

  app.post('/equipamentos', (requisicao, resposta) => {
    try {
      const { id, nomeFuncionario, nomeEquipamento, dataRetirada, dataDevolucao, status } = requisicao.body;
      if (!id || !nomeFuncionario || !nomeEquipamento || !dataRetirada || !dataDevolucao || !status) {
        return resposta.status(200).json(
          {
            mensagem: "Todos os dados devem ser preenchidos corretamente"
          }
        )
      }
      const novoEquipamento = { id, nomeFuncionario, nomeEquipamento, dataRetirada, dataDevolucao, status  };
      bancoDados.push(novoEquipamento);
      resposta.status(201).json({ mensagem: "Equipamento criado com sucesso" });
    } catch (error) { 
      resposta.status(500).json({
        mensagem: "Erro ao cadastrar Equipamento",
        erro: error.message,
      });
    }
  });

  app.put("/equipamento/:id", (requisicao, resposta) => {
    try {
      //localhost:3000/produtos/1
      const id = requisicao.params.id;
      const {  novoFuncionario, novoEquipamento, novaDataRetirada, novaDataDevolucao, novoStatus } = requisicao.body
      if (!id) {
        return resposta.status(404).json({
          mensagem: "informe um parametro!"
        })
      }
      const equipamento = bancoDados.find(elemento => elemento.id === id)
      if (!equipamento) {
        return resposta.status(404).json({mensagem:"Equipamento nao encontrado"})
      }
      equipamento.nomeFuncionario = novoFuncionario
      equipamento.nomeEquipamento = novoEquipamento
      equipamento.dataRetirada = novaDataRetirada
      equipamento.dataDevolucao = novaDataDevolucao
      equipamento.status = novoStatus
       
      resposta.status(200).json({ mensagem: "Equipamento atualizado com sucesso" })
    } catch (error) {
      resposta.status(500).json({
        mensagem: "Erro ao editar Equipamentos!",
        erro: error.message
      });
    }
  })

  app.delete("/equipamentos/:id", (requisicao, resposta) => {
    try {
     const id = requisicao.params.id
     const index = bancoDados.findIndex(elemento => elemento.id === id)
     if(index === -1){
       return resposta.status(404).json({mensagem:"equipamento  nao encontrado"})
     }
     bancoDados.splice(index, 1)
     resposta.status(200).json({mensagem:"equipamento deletado com sucesso"})
    } catch (error) {
     resposta.status(500).json({
       mensagem: "erro ao deletar Equipamento",
       erro: error.message})
     
    }
   })

   app.get("/equipamentos/:id", (requisicao, resposta) => {
    try {
      const id = requisicao.params.id;
      const equipamento = bancoDados.find(elemento => elemento.id === id);
      if(!equipamento){
        return resposta.status(404).json({mensagem:"equipamento nao encontrado"})
      }
      resposta.status(200).json(equipamento)
    } catch (error) {
      resposta.status(500).json({
        mensagem: "erro a buscar equipamento",
        erro: error.message
      })
      
    }
  })

  app.delete("/equipamentos", (requisicao, resposta) => {
    try {
      bancoDados.length = 0;
      resposta.status(200).json({mensagem:"todos os Equipamentos deletados com sucesso"})
    } catch (error) {
      
    }
    })
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });