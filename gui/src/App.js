import './App.scss';
import Home from './components/home/Home';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <span className="logo">
          <div className="vl">
            <span>Image Listing Application</span>
            <p>Display, Rate and Download photos here!</p>
          </div>
        </span>
      </div>

      <div className="App-body">
        <Home></Home>
      </div>
    </div>
  );
}

export default App;
