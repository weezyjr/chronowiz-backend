module.exports.getRandomInt = function(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

module.exports.getRandomPassword = function()
{
    let numberChars = "0123456789";
    let upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let lowerChars = "abcdefghijklmnopqrstuvwxyz";
    let specialChars = "#$_-@!%&*?";

    let allChars = numberChars + upperChars + lowerChars + specialChars;

    let randPasswordArray = Array(20);

    randPasswordArray[0] = numberChars;
    randPasswordArray[1] = upperChars;
    randPasswordArray[2] = lowerChars;
    randPasswordArray[3] = specialChars;

    randPasswordArray = randPasswordArray.fill(allChars, 4);

    return shuffleArray(randPasswordArray.map(function(x)
    {
        return x[Math.floor(Math.random() * x.length)]
    })).join('');
};

function shuffleArray(array)
{
    for(let i = array.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}