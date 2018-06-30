if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/service-worker.js')
        .then((registration)=>{
            /*if (!navigator.serviceWorker.controller){
                return;
            }

            // if theres a worker already waiting, trigger a notification
            if (registration.waiting){
                updateReady();
                return;
            }

            // if theres an updated worker installing, we would track its changes
            if(registration.installing){
                trackInstalling(registration.installing);
                return;
            }

            //listen for new installing workers arriving, track its progress and
            //if it is installed, call the updateReady function

            registration.addEventListener('updatefound', ()=>{
                trackInstalling(registration.installing);
            })
            trackInstalling = (worker)=>{
                worker.addEventlistener('statechange', ()=>{
                    if (worker.state == 'installed'){
                        updateReady();
                    }
                });
            }

            updateReady = (worker)=>{

            }
            */
        })
        .catch((error)=>{
            console.log('Regstration Failed: ', error);
        });
}

