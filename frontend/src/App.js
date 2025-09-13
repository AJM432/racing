import { useState } from 'react';
import logo from './logo.svg';
import BottomBar from './components/BottomBar';
import HomePage from './pages/Home';
import AllRacetracks from './pages/AllRacetracks';
import './App.css';

function App() {
    const [pageViewing, setPageViewing] = useState("feed");

    return (
        <div className="App">
            <BottomBar />
            { pageViewing == "home" ? 
                <HomePage />
            :
                pageViewing == "feed" ?
                    <AllRacetracks />
                :
                    <AllRacetracks />
            }
        </div>
    );
}

export default App;
