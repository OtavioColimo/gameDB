// login 

function  login(username, password) {
            try {
                const response = fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                if (!response.ok) {
                    alert('Erro ao logar verifique os dados.');
                }
                console.log('logado.');
            } catch (error) {
                console.error('Erro:', error);
            }
        }

// cadastro 

function  cadastro(username, password) {
    try {
        const response = fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) {
            alert('cadastro realizado');
        }
        console.log('Erro.');
    } catch (error) {
        console.error('Erro:', error);
    }
}