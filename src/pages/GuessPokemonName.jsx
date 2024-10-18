import { useEffect } from "react";
import { useState } from "react";
import Loading from "../components/Loading";

const GuessPokemonName = () => {
    const [correctPokemon, setCorrectPokemon] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setCorrect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timer, setTimer] = useState(10);
    const [isGameOver, setIsGameOver] = useState(false);

    const TOTAL_QUESTION = 10;
    const TIME_LIMIT = 10;

    const getRandomPokemon = async (id = Math.floor(Math.random() * 150) + 1) => {
        try {            
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Failed to fetch the Pokemon:", error);
            return null;
        }
    };

    const generateOptions = async () => {
        setLoading(true);
        const correct = await getRandomPokemon();
        const incorrectOptions = [];
        console.log(correct);

        while (incorrectOptions.length < 3) {
            const pokemon = await getRandomPokemon();
            if (pokemon.name !== correct.name) {
                incorrectOptions.push(pokemon);
            }
        }

        const allOptions = [...incorrectOptions, correct];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        
        setCorrectPokemon(correct);
        setOptions(shuffledOptions);
        setSelectedAnswer(null);
        setCorrect(false);
        setLoading(false);
        setTimer(TIME_LIMIT);
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        const isAnswerCorrect = answer.name === correctPokemon.name;
        setCorrect(isAnswerCorrect);
        if (isAnswerCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    const nextQuestion = () => {
        if (questionCount < TOTAL_QUESTION - 1) {
            setQuestionCount(prevCount => prevCount + 1);
            generateOptions();
        } else {
            setIsGameOver(true);
        }
    };

    useEffect(() => {
        if (timer > 0 && !selectedAnswer) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1)
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && !selectedAnswer) {
            nextQuestion();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timer, selectedAnswer])

    useEffect(() => {
        generateOptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const restartGame = () => {
        setScore(0);
        setSelectedAnswer(0);
        setQuestionCount(0);
        setIsGameOver(false);
        generateOptions();
    };

    if (loading) return <Loading message="Fetching data, please wait..."  />

    if (isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-blue-500">
                <h1 className="text-5xl font-extrabold text-white mb-8">Game Over!</h1>
                <p className="text-2xl font-semibold text-yellow-300 mb-4">Your final score: {score} / {TOTAL_QUESTION}</p>   
                <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-red-800 py-2 px-6 rounded-full shadow-lg font-bold transition duration-300"
                    onClick={restartGame}
                >
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-blue-500">
            <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-md">Who is That Pokémon?</h1>
    
            <button
                className="bg-white text-gray-800 text-lg py-2 px-5 rounded-full border-2 border-gray-300 font-bold"
                disabled
            >
                Time left: {timer} seconds
            </button>
            
            <div className="text-2xl my-3 text-yellow-300 font-bold drop-shadow-md">Question {questionCount + 1} of {TOTAL_QUESTION}</div>
    
            {/* Pokémon Image Display */}
            {correctPokemon && (
                <div className="relative mb-6 border-4 border-gray-300 rounded-xl overflow-hidden">
                    {/* Background container with opacity */}
                    <div className="absolute inset-0 bg-white bg-opacity-30"></div>
                    <img 
                        src={correctPokemon.sprites.front_default} 
                        alt={correctPokemon.name}
                        className="relative w-32 h-32 object-contain"
                    />
                </div>
            )}

    
            {/* Container for name options */}
            <div className="bg-white bg-opacity-20 p-6 rounded-lg shadow-xl border-2 border-gray-300">
                <div className="grid grid-cols-2 gap-4">
                    {options.map((option) => (
                        <button
                            key={option.name}
                            className={`py-2 px-4 rounded-lg text-white font-semibold shadow-lg ${
                                selectedAnswer
                                    ? option.name === correctPokemon.name
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } transition duration-300`}
                            onClick={() => handleAnswerClick(option)}
                            disabled={selectedAnswer != null}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
    
            {/* Feedback message wrapped in a container */}
            {selectedAnswer && (
                <div className="mt-4 text-center">
                    <div className="inline-block px-5 py-3 bg-white bg-opacity-90 rounded-lg shadow-lg">
                        {isCorrect ? (
                            <p className="text-2xl text-green-500 font-bold drop-shadow-md">🎉 Correct!</p>
                        ) : (
                            <p className="text-2xl text-red-500 font-bold drop-shadow-md">❌ Oops! The correct answer was {correctPokemon.name}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
    
}

export default GuessPokemonName;