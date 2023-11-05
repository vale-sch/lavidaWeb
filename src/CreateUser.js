"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUser = void 0;
function CreateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("result1");
            const { db } = req.app;
            console.log("result2");
            const { name, password } = req.body;
            console.log(req.body);
            if (!name) {
                return res.status(400).json({ message: 'Name is required' });
            }
            if (!password) {
                return res.status(400).json({ message: 'Password is required' });
            }
            console.log("result4");
            // if (!email) {
            //     return res.status(400).json({ message: 'Email is required' });
            // }
            // if (phone && phone.length > 10) {
            //     return res.status(400).json({ message: 'Phone number cannot be longer than 10 digits' });
            // }
            // if (address && address.length > 100) {
            //     return res.status(400).json({ message: 'Address must be less than 100 characters' });
            // }
            // check if customer exists
            // const existingCustomer = await db.collection('customers').findOne({
            //     email: email.toLowerCase()
            // });
            // if (existingCustomer) {
            //     return res.status(400).json({ message: 'Customer already exists' });
            // }
            const result = yield db.collection('users').insertOne({
                name,
                password
            });
            console.log(db.collection('users'), result);
            if (result.acknowledged) {
                res.status(200).json({ message: 'Customer created' });
            }
            else {
                throw new Error('Customer not created');
            }
        }
        catch (error) {
            //@ts-ignore
            res.status(500).json({ error: error.toString() });
        }
    });
}
exports.CreateUser = CreateUser;
