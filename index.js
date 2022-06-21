const { json } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;
const fs = require('fs');
let i = 1;
let contador = 1;

for (let j = 1; j < contador; j++) {
    if (j==contador) {
        return i = 1
    }
    i++;
}

app.use(express.json())

app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get(`/livro/:id`, (req,res) => {

    const {id} = req.params;
    try {
        const livroString = fs.readFileSync(`./src/${id}.json`,'utf-8');
        const livro = JSON.parse(livroString)

        res.status(200).send(
            livro
        )
    } catch (err) {
        console.log(err);
    }
});

app.get('/livros', (req,res) => {
    
    var data = {}
    data.table = []

    for (j = 1; j <= i; j++) {
        try {
        const livroString = fs.readFileSync(`./src/${j}.json`,'utf-8');
        const livro = JSON.parse(livroString);
        data.table.push(livro)
        
        fs.writeFileSync("./src/biblioteca.json",JSON.stringify(data),function(err){
            if (err) throw err;
        })
        } catch (err) {
            console.log(err);
        }
        
    }
    try {
        const bibliotecaString = fs.readFileSync(`./src/biblioteca.json`,'utf-8');
        const biblioteca = JSON.parse(bibliotecaString);

        res.status(200).send(
            biblioteca
        )
    } catch (err) {
        console.log(err);
    }

});

app.post('/livro', (req,res) =>{
    
    const {lsbn} = req.body;
    const {Titulo} = req.body;
    const {Descrição} = req.body;
    const {Gênero} = req.body;

    if(!lsbn || !Titulo || !Descrição || !Gênero){
        res.status(418).send({message:'Você esqueceu de preencher uma das informações essenciais: (lsbn, titulo, descrição, gênero)'})
    } else {
        i++;
        var jsonLivro = `{
            "lsbn":"${lsbn}",
            "Titulo":"${Titulo}",
            "Descrição":"${Descrição}",
            "Gênero":"${Gênero}"
        }`
        var livroParceado = JSON.parse(jsonLivro)
        var livroString = JSON.stringify(livroParceado)
        
        fs.writeFile(`./src/${i}.json`,livroString,'utf-8',function(err){
            if (err) {
                console.log("Ocorreu um erro enquanto tentava escrever o JSON para o arquivo");
                return console.log(err);
            }
            console.log("Seu arquivo JSON foi salvo com sucesso");
        });
        
    }

    res.send({
        livro: `Livro cadastrado com sucesso`
    })
});

app.put('/livro/:id', (req,res) => {
    const {id} = req.params;
    const {lsbn} = req.body;
    const {Titulo} = req.body;
    const {Descrição} = req.body;
    const {Gênero} = req.body;

    if(!lsbn || !Titulo || !Descrição || !Gênero){
        res.status(418).send({message:'Você esqueceu de preencher uma das informações essenciais: (lsbn, titulo, descrição, gênero)'})
    } else {
        var jsonLivro = `{
            "lsbn":"${lsbn}",
            "Titulo":"${Titulo}",
            "Descrição":"${Descrição}",
            "Gênero":"${Gênero}"
        }`
        var livroParceado = JSON.parse(jsonLivro)
        var livroString = JSON.stringify(livroParceado)
        
        fs.writeFile(`./src/${id}.json`,livroString,'utf-8',function(err){
            if (err) {
                console.log("Ocorreu um erro enquanto tentava escrever o JSON para o arquivo");
                return console.log(err);
            }
            console.log("Seu arquivo JSON foi atualizado com sucesso");
        });
        
    }
    res.send({
        livro: `Livro atualizado com sucesso`
    })
});

app.delete('/livro/:id',(req,res)=>{
    const {id} = req.params;

    try {
        fs.unlinkSync(`./src/${id}.json`)
    } catch (err) {
        console.error(err)
    }

    res.send({
        status: `Livro deletado com sucesso`
    })

});