/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import Loading from "../components/Loading";

const GuessPokemonImage = () => {
    const [correctPokemon, setCorrectPokemon] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(false);
    const [loading, setLoading] = useState(false);
    const [score, setScore] = useState(0);
    const [questionCount, setQuestionCount] = useState(0);
    const [timer, setTimer] = useState(10);
    const [isGameOver, setIsGameOver] = useState(false);

    const TOTAL_QUESTIONS = 10;
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
        const correctOptions = await getRandomPokemon();
        const incorrectOptions = [];

        while (incorrectOptions.length < 3) {
            const pokemon = await getRandomPokemon();
            if (pokemon.name !== correctOptions.name) {
                incorrectOptions.push(pokemon);
            }
        }

        const allOptions = [...incorrectOptions, correctOptions];
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5 );

        setCorrectPokemon(correctOptions);
        setOptions(shuffledOptions);
        setSelectedAnswer(null);
        setIsCorrect(false);
        setLoading(false);
        setTimer(TIME_LIMIT);
    };

    const nextQuestion = () => {
        if (questionCount < TOTAL_QUESTIONS - 1) {
            setQuestionCount(prevCount => prevCount + 1);
            generateOptions();
        } else {
            setIsGameOver(true);
        }
    };

    const handleAnswerClick = (answer) => {
        setSelectedAnswer(answer);
        const isAnswerCorrect = answer.sprites.front_default === correctPokemon.sprites.front_default;
        setIsCorrect(isAnswerCorrect);

        if (isAnswerCorrect) {
            setScore(prevScore => prevScore + 1);
        }

        setTimeout(() => {
            nextQuestion();
        }, 1500);
    };

    useEffect(() => {
        if (timer > 0 && !selectedAnswer) {
            const interval = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else if (timer === 0 && !selectedAnswer) {
            nextQuestion();
        }
    }, [timer, selectedAnswer]);

    useEffect(() => {
        generateOptions();
    }, []);

    const restartGame = () => {
        setScore(0);
        setSelectedAnswer(null);
        setQuestionCount(0);
        setIsGameOver(false);
        generateOptions();
    };

    if (loading) return <Loading message="Fetching data, please wait" />

    if (isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-red-500 to-blue-500">
                <h1 className="text-5xl font-extrabold text-white mb-8">Game Over!</h1>
                <p className="text-2xl font-semibold text-yellow-300 mb-4">Your final score: {score} / {TOTAL_QUESTIONS}</p>
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
                className="bg-white text-gray-800 text-lg py-2 px-5 rounded-full border-2 border-gray-300 shadow-sm font-bold"
                disabled
            >
                Time left: {timer} seconds
            </button>
    
            <div className="text-2xl my-3 text-yellow-300 font-bold drop-shadow-md">Question {questionCount + 1} of {TOTAL_QUESTIONS}</div>
    
            {correctPokemon && (
                <div className="mb-6 px-6 py-3 bg-white rounded-xl shadow-md border-gray-300 border-4 transition duration-500">
                    <p className="text-center text-gray-800 font-bold text-2xl">{correctPokemon.name}</p>
                </div>
            )}
    
            {/* Semi-transparent container for Pokémon options */}
            <div className="bg-white bg-opacity-20 p-8 rounded-lg shadow-xl border-2 border-gray-300">
                <div className="grid grid-cols-2 gap-6">
                    {options.map((option) => (
                        <button
                            key={option.name}
                            className={`py-3 px-4 rounded-full text-white font-extrabold shadow-lg ${
                                selectedAnswer
                                    ? option.name === correctPokemon.name
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                    : 'bg-blue-700 hover:bg-blue-800'
                            } transition duration-300`}
                            onClick={() => handleAnswerClick(option)}
                            disabled={selectedAnswer != null}
                        >
                            <img 
                                src={option.sprites.front_default} 
                                alt={option.name}
                                className="w-32 h-32 object-contain"
                            />
                        </button>
                    ))}
                </div>
            </div>
    
            {/* Feedback message wrapped in a container to stand out */}
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

export default GuessPokemonImage;