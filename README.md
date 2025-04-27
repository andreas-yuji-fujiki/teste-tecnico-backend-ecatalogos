# Teste Técnico - Backend

Este repositório contém o código do teste técnico realizado para desenvolvimento de uma API de gerenciamento de produtos. O sistema permite realizar operações como obter, cadastrar, atualizar e deletar produtos com base em um banco de dados MySQL. Além disso, implementa filtros e paginação nas rotas de consulta de produtos.

## Tecnologias Necessárias

- NodeJs
- Express
- TypeScript
- Prisma
- MySQL

## Estrutura do Projeto

O projeto segue uma arquitetura organizada utilizando boas práticas. A estrutura do projeto é dividida da seguinte forma:

- **Routes**: Definem as rotas da API.
- **Middlewares**: Funções para processar as requisições antes de chegarem aos controladores.
- **Controllers**: Contêm a lógica das rotas.
- **Models**: Representações das entidades no banco de dados, utilizando Prisma.
- **Classes**: O projeto foi construído utilizando classes para organizar a lógica e a estrutura do código.

## Banco de Dados

O banco de dados MySQL é utilizado com o ORM Prisma, e o dump fornecido contém as tabelas e os vínculos de produtos.

- [forca_de_vendas_dump.sql](attachment:ba35eecf-b261-4b4f-a3f8-9158862591e2:forca_de_vendas_dump.sql)

### Estrutura de Produtos

A API foi projetada para lidar com produtos, variantes e SKUs. Produtos podem ter várias variantes (cores) e cada variante pode ter múltiplos tamanhos, com preços específicos. O fluxo de dados é o seguinte:

- **Produtos → Variantes → Skus → Tabela_de_Preços_Skus**

### Exemplo de Produto

Aqui está um exemplo de como um produto será retornado pela API:

```json
{
  "id": 60222,
  "name": "Jaqueta Aurora",
  "variant_name": "Preto",
  "hex_code": "#000000",
  "reference": "20.09.0000",
  "gender": "Feminino",
  "category": "Inverno Feminino",
  "subcategory": null,
  "prompt_delivery": true,
  "description": null,
  "type": null,
  "skus": [
    {
      "id": 215337,
      "size": "G",
      "price": 80,
      "stock": 500,
      "open_grid": false,
      "min_quantity": 4
    },
    {
      "id": 215338,
      "size": "GG",
      "price": 80,
      "stock": 500,
      "open_grid": false,
      "min_quantity": 1
    },
    {
      "id": 215335,
      "size": "M",
      "price": 80,
      "stock": 500,
      "open_grid": false,
      "min_quantity": 1
    },
    {
      "id": 215336,
      "size": "P",
      "price": 80,
      "stock": 500,
      "open_grid": false,
      "min_quantity": 4
    }
  ],
  "companies": {
    "key": 2007
  },
  "brand": "Marca Moda"
}
```
