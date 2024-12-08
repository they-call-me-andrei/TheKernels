import mongoose from "mongoose"

const produseSchema = mongoose.Schema(
    {
        nume:{
          type : String,
          required: true
        },
        pret:{
            type : Number,
            required: false
        },
        descriere:{
            type : String,
            required: false
        },
        poza:{
            type : String,
            required: false
        },
        gramaj:{
            type : Number,
            required: true
        },
        tip:{
            type : String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

export const Produse = mongoose.model("Produse", produseSchema);