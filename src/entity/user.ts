import { v4 as uuidv4 } from 'uuid';

export class User {
    private _id: string;
    private _username: string;
    private _age: number;
    private _hobbies: string[];

    constructor(username: string, age: number, hobbies: string[]) {
        this._id = uuidv4();
        this._username = username;
        this._age = age;
        this._hobbies = hobbies;
    }

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get age(): number {
        return this._age;
    }

    set age(value: number) {
        this._age = value;
    }

    get hobbies(): string[] {
        return this._hobbies;
    }

    set hobbies(value: string[]) {
        this._hobbies = value;
    }

    toJSON(): object {
        return {
            id: this._id,
            username: this._username,
            age: this._age,
            hobbies: this._hobbies
        };
    }
}
