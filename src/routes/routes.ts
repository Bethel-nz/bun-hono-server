
import { Hono } from "hono"
import fs from 'fs'
import { readFromFile, writeToFile } from "../util/lib"
const route = new Hono()
 
type MovieData = {
	title: string;
	year: string,
	genre: string,
	rating: string,
	id:number
}

route.get("/", async (c) => {
	const data = await  readFromFile()
	return c.json({data})
}).post('/add-movie', async (c) => {
  const rawBody = await c.req.text();
  const { title, year, genre, rating }: MovieData = JSON.parse(rawBody);
	const data = {
		title,
		year,genre, rating, id: (await readFromFile()).length + 1
	}
	writeToFile(data)
  return c.json({ status: 201 })
}).get("/:movie-name",async (c) => {
	const movieName = c.req.param('movie-name')
	const data = await readFromFile()
	let searchedMovie = data.filter((movie: MovieData) => movie.title.toLowerCase().includes(movieName.toLowerCase()))
	return c.json(searchedMovie)
}).patch('/update-movie/:id', async (c) => {
	const id = c.req.param('id');
	const rawBody = await c.req.json();
 const { title, year, genre, rating }: Partial<MovieData> = JSON.parse(rawBody);

 const oldData = await readFromFile();
 const movieIndex = oldData.findIndex((movie: MovieData) => movie.id === Number(id));

 if (movieIndex === -1) {
   return c.json({ status: 404, message: 'Movie not found' });
 }

 const updatedMovie = { ...oldData[movieIndex], title, year, genre, rating };
 oldData[movieIndex] = updatedMovie;

 await writeToFile(oldData);
 return c.json({ status: 200, message: 'Movie updated successfully' });
}).delete('/delete-movie/:id', async (c) => {
 const id  = c.req.param('id');

 const oldData = await readFromFile();
 const movieIndex = oldData.findIndex((movie: MovieData) => movie.id === Number(id));

 if (movieIndex === -1) {
   return c.json({ status: 404, message: 'Movie not found' });
 }

 oldData.splice(movieIndex, 1);

 await writeToFile(oldData);
 return c.json({ status: 200, message: 'Movie deleted successfully' });
})




export default route