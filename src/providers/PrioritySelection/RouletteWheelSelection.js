const RouletteWheelSelection = (array = [1,2,3,4,5]) => {
    if(array.length > 5) {
        alert('太长了！');
        return;
    }
    const weight = [1/3, 4/15, 1/5, 2/15, 1/15];
    const cum_weight = weight.map((w, i) => weight.slice(0, i+1).reduce((a, b) => a + b));
    const random_num = Math.random() * cum_weight[array.length-1];
    for (let i = 0; i < array.length; i++) {
        if (random_num < cum_weight[i]) {
            return array[i];
        }
    }
}

export default RouletteWheelSelection;