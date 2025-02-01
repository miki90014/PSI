import React from 'react';
import NavBar from './NavBar';  // Importujemy komponent paska nawigacyjnego

function Home() {
  return (
    <div>
      <h1>Witaj na stronie głównej!</h1>
      <NavBar />  {/* Wyświetlamy pasek nawigacyjny */}
      <div>
        <h2>Witaj w panelu głównym po zalogowaniu!</h2>
        <p>Wybierz jedną z opcji na pasku nawigacyjnym, aby przejść do odpowiedniej sekcji.</p>
      </div>
    </div>
  );
}

export default Home;
