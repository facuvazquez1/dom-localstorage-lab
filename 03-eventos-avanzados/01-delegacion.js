// 1. Ponerle un único click listener a #lista. Al hacer click en cualquier
//    parte (incluso el <ul> vacío, fuera de los <li>), mostrar por consola
//    event.target y event.currentTarget por separado.




// 2. Modificar el listener anterior: cuando se clickea un <li>, mostrar por
//    consola su data-id. Cuando se clickea el <ul> pero fuera de un <li>,
//    no mostrar nada.


// 3. Usando el mismo listener delegado, hacer que al clickear un <li> se le
//    alterne la clase "completado" (agregá el CSS que necesites para verlo).


// 4. Agregar un botón #agregar fuera de la lista. Al clickearlo, insertar un
//    nuevo <li> con un data-id incremental. Verificar que el listener
//    delegado también funciona sobre este <li> nuevo, sin tocar el
//    addEventListener de nuevo.