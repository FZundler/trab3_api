import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Rota para criar uma nova proposta para um cliente
router.post('/', async (req, res) => {
  const { clienteId, produtoId, descricao } = req.body;

  try {
    const novaProposta = await prisma.proposta.create({
      data: {
        descricao,
        clienteId, 
        produtoId, 
      },
    });
    res.status(201).json(novaProposta);
  } catch (error) {
    console.error(error); 
    res.status(400).json({ message: "Erro ao criar proposta." });
  }
});

// Rota para listar todas as propostas de um cliente específico
router.get('/:clienteId', async (req, res) => {
  const { clienteId } = req.params;

  try {
    const propostasDoCliente = await prisma.proposta.findMany({
      where: {
        clienteId,
      },
      include: { produto: true }, // Inclui os dados do produto associado à proposta
    });

    if (propostasDoCliente.length === 0) {
      return res.status(404).json({ message: "Nenhuma proposta encontrada para este cliente." });
    }

    res.json(propostasDoCliente);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erro ao listar propostas." });
  }
});

// Rota para atualizar uma proposta
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao } = req.body;

  try {
    const propostaAtualizada = await prisma.proposta.update({
      where: { id: Number(id) },
      data: { descricao },
    });
    res.json(propostaAtualizada);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Proposta não encontrada." });
  }
});

// Rota para deletar uma proposta
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.proposta.delete({
      where: { id: Number(id) },
    });
    res.status(204).send(); // Retorna 204 No Content
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Proposta não encontrada." });
  }
});

export default router;
