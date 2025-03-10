const express = require('express');
const dotenv = require('dotenv');
const {pool} = require('./src/config/database')
dotenv.config();

const port = process.env.PORTA;
const app = express();

//aplicacao use express como json(javascript object notation)
app.use(express.json());


app.get('/equipamentos', async (requisicao, resposta) => {
    //tratamento de excessoes
    try {
      const consulta = 'select * from equipamento'
      const equipamentos = await pool.query(consulta)
      if (equipamentos.rows.length === 0) {
        return resposta.status(200).json({ mensagem: "banco de dados vazio" })
      }
  
      resposta.status(200).json(equipamentos.rows);
  
    } catch (error) {
      resposta.status(500).json({ mensagem: "erro ao buscar equipamentos", erro: error.message })
  
    }
  });

  app.post('/equipamentos', async (requisicao, resposta) => {
    try {
      const {  nomeFuncionario, nomeEquipamento, dataRetirada, dataDevolucao, status } = requisicao.body;
      if ( !nomeFuncionario || !nomeEquipamento  || !dataRetirada || !dataDevolucao || !status) {
        return resposta.status(200).json(
          {
            mensagem: "Todos os dados devem ser preenchidos corretamente"
          }
        )
      }
      const dados = [ nomeFuncionario, nomeEquipamento, dataRetirada, dataDevolucao, status  ];
      const consulta = `insert into equipamento(nomeFuncionario, nomeEquipamento, dataRetirada, dataDevolucao, status)
                         values ($1, $2, $3, $4, $5) returning *`
      const resultado = await pool.query(consulta, dados)
      resposta.status(201).json({ mensagem: "Equipamento criado com sucesso" });
    } catch (error) {
      resposta.status(500).json({
        mensagem: "erro ao Criar equipamentos",
        erro: error.message})
    }
  });

  app.put("/equipamento/:id", async (requisicao, resposta) => {
    try {
      //localhost:3000/produtos/1
      const id = requisicao.params.id;
      const {  nomeFuncionario, nomeEquipamento, dataRetirada, dataDevolucao, status  } = requisicao.body
      if (!id) {
        return resposta.status(404).json({
          mensagem: "informe um parametro!"
        })
      }
      const dados1 = [id]
      const consulta1 = `select *from equipamento where id = $1`
      const resultado1 = await pool.query(consulta1, dados1)
  
      if (resultado1.rows.length === 0) {
        return resposta.status(404).json({mensagem:"Produto nao encontrado"})
      }
      const dados2 = [id, novoFuncionario, novoEquipamento, novaDataRetirada, novaDataDevolucao, novoStatus]
      const consulta2 = `update equipamento set nomeFuncionario = $2, nomeEquipamento = $3, dataRetirada = $4, dataDevolucao = $5, status = $5, where id = $1 returning * `
      await pool.query(consulta2, dados2)
      resposta.status(200).json({ mensagem: "Equipamento atualizado com sucesso" })
    } catch (error) {
      resposta.status(500).json({
        mensagem: "erro ao Editar equipamento",
        erro: error.message})
    }
  })

  app.delete("/equipamentos/:id", async (requisicao, resposta) => {
    try {
      const id = requisicao.params.id
      const dados1 = [id]
      const consulta1 = `select * from equipamento where id = $1`
      const resultado1 = await pool.query(consulta1, dados1)
      if(resultado1.rows.length === 0){
        return resposta.status(404).json({mensagem:"equipamento nao encontrado"})
      }
      const dados2 = [id]
      const consulta2 = `delete from  equipamento where id = $1`
      await pool.query(consulta2,dados2)
      resposta.status(200).json({mensagem:"equipamento deletado com sucesso"})
     } catch (error) {
      resposta.status(500).json({
        mensagem: "erro ao deletar equipamento",
        erro: error.message})
     
    }
   })

   app.get("/equipamentos/:id", async (requisicao, resposta) => {
    try {
      const id = requisicao.params.id;
    const dados1 = [id]
    const consulta1 = `select * from equipamento where id =$1`
    const resultado1 = await pool.query(consulta1, dados1)
    if(resultado1.rows.length === 0){
      return resposta.status(404).json({mensagem:"equipamento nao encontrado"})
    }
    resposta.status(200).json(resultado1.rows[0])
  } catch (error) {
    resposta.status(500).json({
      mensagem: "erro a buscar equipamento",
      erro: error.message
    })
      
    }
  })

  app.delete("/equipamentos", async (requisicao, resposta) => {
    try {
      const consulta = `delete from equipamento`
  await pool.query(consulta)
  resposta.status(200).json({mensagem:"todos os Equipamentos deletados com sucesso"})
} catch (error) {
  resposta.status(500).json({
    mensagem: "erro ao deletar todos Equipamentos",
    erro: error.message
})
}
})
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
    });