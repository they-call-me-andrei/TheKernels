import mongoose from "mongoose";

const utilizatorSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: false
        },
        password: {
            type: String,
            required: false
        },
        nume: {
            type: String,
            required: false
        },
        prenume: {
            type: String,
            required: false
        },
        numarCredite: {
            type: Number,
            required: false
        },
        cosCurent: {
            pretTotal: {
                type: Number,
                required: false,
            },
            items: {
                type: [String],
                required: false,
                
            }
        }
    },
    {
        timestamps: true
    }
);

export const Utilizator = mongoose.model("Utilizator", utilizatorSchema);