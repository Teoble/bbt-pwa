###################
BBT - Service Worker
###################



Instruções para o teste

1. Faça download do projeto ou instale o GIT e execute um `git clone git@github.com:Teoble/bbt-pwa.git`
2. Utilize o XAMPP ou execute através de linha de comando na raiz do projeto o comando "php -S localhost:____"
3. Abra URL, abra o inspecionar do seu navegador(Chrome de preferencia) e vá até a aba Application. Espera-se obter:
    - Na Seção Service Worker deverá estar registrado o "service-worker.js"
    - Em Cache Storage deverá aparecer o "bbt-cache-1.0"
    - Em IndexedDB deverá ter a tabela CacheVersion
4. Vá até a aba Network e deixe Offline. A página deve recarregar normalmente
5. Ainda Offline, modifique algo relacionado ao CSS ou o JS do Welcome e recarregue a página. Nada deverá ser afetado
6. Modifique a rota version no Controller do Welcome para "2.0v" e desative o modo Offline e recarregue a página
7. A mudança foi aplicada


    
