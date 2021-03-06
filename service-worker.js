const CACHE_NAME = 'babertech-cache-1.0'
const FILES = [
    './', //raiz do site
    './service-worker.js'
]

const URL = "http://localhost:8000"

//variaveis de comunicação com o IndexedDB
let request;
let db;

//evento de instalação do service worker
self.addEventListener('install', function(event){
    event.waitUntil(
        //abre o cache registrado e adiciona todos os arquivos do array
        addURLsToCache()
    );
})

self.addEventListener('activate', function (event) {
    event.waitUntil(
        //se houver CACHE_NAME diferente é registrado 
        caches.keys().then(function (keys) {
            return Promise.all(keys
                .filter(function (key) {
                    return key.indexOf(CACHE_NAME) !== 0;
                })
                .map(function (key) {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event){    
        //verifica na API se há uma versão nova, se houver pega do servidor senão, pega do cache 
        event.respondWith(
            caches.match(event.request).then(function(response){
                return willUseCache(event.request.url).then(res => {
                    if(res && typeof response !== "undefined"){
                        return response;
                    }                         
                    else{
                        addAssetToCache(event.request.url);
                        return fetch(event.request.url+"?v="+Math.random());
                    }                        
                });                
            })
        );        
})

function addURLsToCache(){
    //abre o cache registrado e adiciona todos os arquivos do array
    caches.delete(CACHE_NAME);
    caches.open(CACHE_NAME).then(function(cache){
        return cache.addAll(FILES);
    })
}

function addAssetToCache(url){
    if(/^.*\.(css|ttf|woff|woff2|eof|js|png|jpg|gif|svg)$/ig.test(url)){
        fetch(url+"?v="+Math.random()).then(function(response) {
            return caches.open(CACHE_NAME).then(function(cache) {
                return cache.put(url, response);
            });
        });
    }
}

function willUseCache(url){
    return new Promise(resolve => {
        //Se for algum arquivo de asset retorna resposta para pegar do cache
        if(url !== URL + "/")
            return resolve(true);
        //Se a requisição for a raiz "/", pega versão na API
        getVersion().then(data =>{   
            //inicia IndexdDB
            startDB().then(() => {
                //Procura pela versão retornada da api
                find(data.version).then(version => {
                    if(!version){
                        // se for uma versão nova ele limpa a base IndexedDB
                        clear();
                        // Insere a versão
                        insert(data);
                        addURLsToCache();
                        // e retorna que não irá usar o cache
                        resolve(false);
                    }else{
                        //Se a versão é a mesma, retorna que irá usar o cache
                        resolve(true);
                    }                                
                });
            });
        })
        .catch(err => {
            // Se não houver internet, usará o cache
            resolve(true);
        });
    });
}

function getVersion(){
    // Chama a API
    return fetch(URL + '/welcome/version').then(
        res => res.json()
    );
}

//Inicia o IndexedDB
function startDB(){
    return new Promise(resolve => {
        request = indexedDB.open('barberTech', 1);
        request.onsuccess = (event) => {
            if(!db)
                db = request.result;
            resolve(db);
        }
    
        request.onupgradeneeded = (event) => {
            db = event.target.result;
            //Configura a tabela como chave a versão
            db.createObjectStore('cacheVersion', { keyPath: 'version' });
        }
    })
}

function getObjectStore(){
    // Como se fosse o Active Recorder do IndexdedDB
    return db.transaction(['cacheVersion'], 'readwrite').objectStore('cacheVersion');
}

function insert(item){

    var request = getObjectStore().add(item);
    request.onsuccess = (event) => {
        return;
    }
}

function clear(){

    var request = getObjectStore().clear();
    request.onsuccess = (event) => {
        return;
    }
}

function find(version){
    return new Promise(resolve => {
        var request = getObjectStore().get(version);
        request.onsuccess = (event) => {
            resolve(request.result);
        }
    });    
}