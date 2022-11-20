(async function(){
    const a = await import('chalk-animation')
    const animation = a.default.rainbow('test')
    console.log('something')
    animation.start()
})()