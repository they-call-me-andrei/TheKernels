import express from "express";
import {PORT, mongoDBURL} from "./config.js"
import mongoose from "mongoose"
import cors from "cors"
import { Utilizator } from "./models/modelUtilizator.js";
import { Produse } from "./models/modelProduse.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/utilizator/register", async (request, response)=>{
    const oldUser = await Utilizator.findOne({email: request.body.email});

    if(oldUser){
        return response.send({data : "Exista deja un utilizator cu acest email."});
    }

    try{
        const newUser = {
            email: request.body.email,
            password: request.body.password,
            phone: request.body.phone,
            nume: request.body.nume,
            prenume: request.body.prenume,
            numarCredite:0,
            cosCurent: {
                pretTotal: 0,
                items: []
            }
        }
        
        const user = await Utilizator.create(newUser);
        return response.status(201).send(user);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

app.post("/utilizator/login", async (request, response)=>{
    const oldUser = await Utilizator.findOne({email: request.body.email});

    if(!oldUser){
        return response.send({data : "Nu exista niciun utilizator cu acest email!"});
    }
    if(oldUser.password == request.body.password){
        return response.status(201).send({data: "Corect", idUtilizator: oldUser._id});
    }else{
        return response.status(201).send({data: "Incorect"});
    }
})

app.get("/utilizator/:id", async (request, response)=>{
    try {
        var id_param = request.params.id;

        const result = await Utilizator.findById(id_param);

        return response.status(200).json(result);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

app.post("/produse/adauga-produse", async (request, response)=>{
    try{
        const newProdus = {
            nume: request.body.nume,
            pret: request.body.pret,
            descriere: request.body.descriere,
            poza:request.body.poza,
            gramaj: request.body.gramaj,
            tip: request.body.tip
        }
        
        const produs = await Produse.create(newProdus);
        return response.status(201).send(produs);
    }catch(error){
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

app.get("/produse/:id", async (request, response)=>{
    try {
        var id_param = request.params.id;

        const result = await Produse.findById(id_param);

        return response.status(200).json(result);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
})

app.delete("/coscurent/:idUtilizator/remove/:idProdus", async (request, response) => {
    try {
        const { idUtilizator, idProdus } = request.params;
        
        const utilizator = await Utilizator.findById(idUtilizator);

        const produs = await Produse.findById(idProdus);

        const index = utilizator.cosCurent.items.indexOf(idProdus);
        if (index > -1) {
            utilizator.cosCurent.items.splice(index, 1);
        } else {
            return response.status(404).json({ message: "Produsul nu se află în coș" });
        }

        utilizator.cosCurent.pretTotal -= produs.pret;

        await utilizator.save();

        return response.status(200).send({ message: "Produsul a fost șters cu succes din coș" });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

app.put("/coscurent/:idUtilizator/add/:idProdus", async (request, response) => {
    try {
        const { idUtilizator, idProdus } = request.params;

        const utilizator = await Utilizator.findById(idUtilizator);
        if (!utilizator) {
            return response.status(404).json({ message: "Utilizatorul nu a fost găsit" });
        }

        const produs = await Produse.findById(idProdus);
        if (!produs) {
            return response.status(404).json({ message: "Produsul nu a fost găsit" });
        }

        utilizator.cosCurent.items.push(idProdus);

        utilizator.cosCurent.pretTotal += produs.pret;

        await utilizator.save();

        return response.status(200).send({ message: "Produsul a fost adăugat cu succes în coș" });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


app.get("/get-cantaribile", async (request, response) => {
    try {
        const result = await Produse.find({tip:"cantaribil"});

        if (!result || result.length === 0) {
            return response.status(404).json({ message: "Nu exista produse cantaribile." });
        }

        return response.status(200).json({
            count: result.length,
            data: result
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

app.put("/coscurent/cantaribil/:idUtilizator/add/:idProdus/:weight", async (request, response) => {
    try {
        const { idUtilizator, idProdus, weight} = request.params;

        const utilizator = await Utilizator.findById(idUtilizator);
        if (!utilizator) {
            return response.status(404).json({ message: "Utilizatorul nu a fost găsit" });
        }

        const produs = await Produse.findById(idProdus);
        if (!produs) {
            return response.status(404).json({ message: "Produsul nu a fost găsit" });
        }

        utilizator.cosCurent.items.push(idProdus);

        utilizator.cosCurent.pretTotal += produs.pret * weight;

        await utilizator.save();

        return response.status(200).send({ message: "Produsul a fost adăugat cu succes în coș" });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

app.delete("/complete-payment/:id", async (request, response) => {
    try {
        var id_param = request.params.id;

        const utilizator = await Utilizator.findById(id_param);

        if (!utilizator) {
            return response.status(404).send({ message: "Utilizatorul nu a fost găsit" });
        }

        await Produse.deleteMany({ tip: "double" });

        utilizator.cosCurent.items = [];
        utilizator.cosCurent.pretTotal = 0;
        await utilizator.save();

        return response.status(200).send({ message: "Toate produsele de tip 'double' au fost șterse cu succes, iar coșul a fost resetat" });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

mongoose.connect(mongoDBURL).then(()=>{
    console.log("App conected to database");
    app.listen(PORT, ()=>{
        console.log(`App is listening on port ${PORT}`);
    })
}).catch((error)=>{
    console.log(error);
})
