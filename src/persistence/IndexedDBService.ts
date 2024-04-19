import { Loan } from "../models/Loan";

export class IndexedDBService {
    private dbName: string;
    private dbVersion: number;
    private db: IDBDatabase | null = null;

    constructor(dbName: string, dbVersion: number) {
        this.dbName = dbName;
        this.dbVersion = dbVersion;
    }

    public async openDatabase(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('Error al abrir la base de datos');
                reject();
            };

            request.onsuccess = (event) => {
                console.log('Base de datos abierta correctamente');
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                console.log('Actualización de la versión de la base de datos');
                this.db = (event.target as IDBOpenDBRequest).result;
                const objectStore = this.db.createObjectStore('loans', { keyPath: 'id' });
                objectStore.createIndex('payDate', 'payDate');
                console.log('Base de datos creada');
            };
        });
    }

    public async addLoan(loan: Loan): Promise<void> {
        if (!this.db) {
            throw new Error('La base de datos no está abierta');
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db?.transaction(['loans'], 'readwrite');
            if (transaction) {
                const objectStore = transaction.objectStore('loans');
                if (objectStore) {
                    const request = objectStore.add(loan);
                    request.onsuccess = () => {
                        console.log('Préstamo agregado correctamente');
                        resolve();
                    };
                    request.onerror = () => {
                        console.error('Error al agregar el préstamo');
                        reject();
                    };
                }
            }
        });
    }

    public async getAllLoans(): Promise<Loan[]> {
        if (!this.db) {
            throw new Error('La base de datos no está abierta');
        }
        return new Promise((resolve, reject) => {
            const transaction = this.db?.transaction(['loans'], 'readonly');
            if (transaction) {
                const objectStore = transaction.objectStore('loans');
                if (objectStore) {
                    const request = objectStore.getAll();
                    request.onsuccess = () => {
                        const loans: Loan[] = request.result;
                        resolve(loans);
                    };
                    request.onerror = () => {
                        console.error('Error al obtener los préstamos');
                        reject();
                    };
                }
            }
        });
    }

    //TODO Implementa los métodos updateLoan y deleteLoan según tus necesidades
}