// App.tsx

import {Outlet} from "react-router-dom";
import FlashMessageComponent
    from "./components/flashes/FlashMessageComponent.tsx";
import NavBar from "./components/navigation/NavBar.tsx";

function App() {
    
    return (
            <div>
                
                <NavBar></NavBar>


                {/*Outlet make this component the parent component of the routes that were given in the main.tsx file
                i.e. everything that is displayed in the route system get
                 displayed in this */}
                <FlashMessageComponent/>
                <Outlet />
                
                {/*Footer here*/}
            </div>
    );
}

export default App;
