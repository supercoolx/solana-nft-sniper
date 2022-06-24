import React from 'react';
import Home from 'pages/Home';
import Collection from 'pages/Collection';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/collection/:symbol' element={<Collection />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App;
