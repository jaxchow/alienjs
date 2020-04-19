import app from './app'

app.listen(4000, (err) => {
	if (err) throw err;
	console.log("alien app is running! visit http://localhost:4000")
});
