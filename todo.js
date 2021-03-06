'use strict';
import fs from 'fs';
import minimist from 'minimist';

const args = minimist(process.argv);
const fileName = "data/todoData.json"
let todoList = [];

try {
    //Read data from todoData.json
    if (fs.existsSync(fileName)) {
        todoList = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    } else {
        console.log("Létre lett hozva, az eddig nem létező adat file!")
        fs.writeFileSync(fileName, '[]');
    }
    //Main menu
    if (args.l) {
        printToDoList(todoList);
    } else if (args.a) {
        addNewElement(args.a, todoList)
    } else if (args.r) {
        removeElement(args.r, todoList)
    } else if (args.c) {
        completeElement(args.c, todoList)
    } else if (Object.keys(args).length > 0) {
        console.log("Nem támogatott argumentum!");
        printUserManual()
    } else {
        printUserManual()
    }
} catch (err) {
    console.error(err);
}

//  ---------  FUNCTIONS  ---------  

function printToDoList(todoList) {
    let nothingTodo = true
    for (let i = 0; i < todoList.length; i++) {
        nothingTodo = todoList[i].done && nothingTodo ? true : false;
        console.log(`  ${todoList[i].id} - [${todoList[i].done ? "x" : " "}] ${todoList[i].name}`);
    }
    if (nothingTodo) {
        console.log("Nincs mára tennivalód! :)");
    }
}

function addNewElement(newElement, todoList) {
    if (typeof newElement === "boolean") {
        console.log("Nem lehetséges új feladat hozzáadása: nincs megadva a feladat!");
    } else {
        todoList.push({ id: todoList.length + 1, name: newElement, done: false })
        fs.writeFileSync(fileName, JSON.stringify(todoList, null, 2));
    }
}

function removeElement(removeElement, todoList) {
    let errorVariableText = "eltávolítás";
    if (checkIndex(removeElement, errorVariableText, todoList)) {
        todoList.splice((removeElement - 1), 1);
        //reindex
        for (let i = 0; i < todoList.length; i++) {
            todoList[i].id = i + 1
        }
        fs.writeFileSync(fileName, JSON.stringify(todoList, null, 2));
    }
};

function completeElement(complElement, todoList) {
    let errorVariableText = "elvégzettre állítás";
    if (checkIndex(complElement, errorVariableText, todoList)) {
        todoList[complElement - 1].done = true
        fs.writeFileSync(fileName, JSON.stringify(todoList, null, 2));
    }
};

function checkIndex(indexNumber, errorVariableText, todoList) {
    if (typeof indexNumber === "boolean") {
        console.log(` Nem lehetséges az ${errorVariableText}: nem adott meg indexet!`);
    } else if (typeof indexNumber !== "number") {
        console.log(`Nem lehetséges az ${errorVariableText}: a megadott index nem szám!`);
    } else if (todoList.length === 0) {
        console.log(`A tudu lista nem tartalmaz elemet, nincs lehetőség ${errorVariableText}ra!`);
    } else if (todoList.length < indexNumber) {
        console.log(`Nem lehetséges az ${errorVariableText}: túlindexelési probléma adódott!`);
    } else {
        return true
    }
    return false
};

function printUserManual() {
    const forPrint = [
        "Parancssori Todo applikáció",
        "=============================",
        "  ",
        "-l   Kilistázza a feladatokat (list)",
        "-a   Új feladatot ad hozzá (add)",
        "-r   Eltávolít egy feladatot (remove)",
        "-c   Teljesít egy feladatot (complete)"]
    forPrint.forEach(element => console.log(element));
};