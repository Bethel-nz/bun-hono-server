import  Bun  from 'bun';
import path from 'path';

const db_path = path.join('./src/', 'data', 'db.json')
console.log(db_path)

export async function writeToFile<T extends object>(data:T): Promise<void> {
 try {
     const file = Bun.file(db_path);
     await Bun.write(file, JSON.stringify(data));
 } catch (error) {
     console.log(error);
 }
}

export async function readFromFile(): Promise<any> {
 try {
     const file = Bun.file(db_path, { type: 'application/json' });
	 const data = await file.text();
     return JSON.parse(data)
 } catch (error) {
     console.log(error);
 }
}