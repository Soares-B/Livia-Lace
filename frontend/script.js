function changePage(button){
    if (button.id === 'headerShopButton'){
        window.location.href = "http://localhost:5000/Catalogue.html"
    }else if (button.id === 'account'){
        window.location.href = "http://localhost:5000/Login.html"
    }
}

const API_URL = "https://livia-lace.onrender.com";

async function checkServer() {

  try {

    const response = await fetch(`${API_URL}/health`);

    if (!response.ok) {
      throw new Error("Servidor não respondeu");
    }

    const data = await response.json();

    console.log(data);

  } catch (error) {
    console.error(error);

  }
}

checkServer();

