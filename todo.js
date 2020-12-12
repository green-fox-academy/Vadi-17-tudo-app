'use strict';
import fs from 'fs';
import minimist from 'minimist';

const args = minimist(process.argv);
let fileName = "data/todoData.json"
let todoList = [];

try {

    //Read data from todoData.json
    if (fs.existsSync(fileName)) {
        todoList = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    } else {
        fs.writeFileSync(fileName, '[]');
    }

    //Main menu
    if (args.l) {
        printToDoList(todoList);
    } else if (args.a) {
        addNewElement(args.a)
    } else if (args.r) {
        removeElement(args.r,todoList)
    } else if (args.c) {
        completeElement(args.c)
    } else {
        printUserManual()
    }
} catch (err) {
    console.error(err);
}


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

function addNewElement(newElement) {
    if (typeof newElement === "boolean") {
        console.log("Nem lehetséges új feladat hozzáadása: nincs megadva a feladat!");
    } else {
        todoList.push({ id: todoList.length + 1, name: newElement, done: false })
        fs.writeFileSync(fileName, JSON.stringify(todoList, null, 2));
    }
}

function removeElement(removeElement,todoList){
    console.log(typeof removeElement);
    console.log(removeElement);
    if (typeof removeElement === "boolean"){
        console.log("Nem lehetséges az eltávolítás: nem adott meg indexet!");
    }else if (typeof removeElement !== "number"){
        console.log("Nem lehetséges az eltávolítás: a megadott index nem szám!");
    }else if(todoList.length <= 0){
        console.log("A tudu lista nem tartalmaz elemet, nincs mit törölni!");
    }else if(todoList.length < removeElement){
        console.log("Nem lehetséges az eltávolítás: túlindexelési probléma adódott!");
    }else{
        todoList.splice((removeElement - 1), 1);
        //reindex
        for (let i = 0; i < todoList.length; i++) {
            todoList[i].id = i+1
        }
        //writing
        fs.writeFileSync(fileName, JSON.stringify(todoList, null,2));

    }
};

function completeElement(complElement) {
};