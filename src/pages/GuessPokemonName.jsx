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
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        return data;
    };

    const generateOptions = async () => {
        setLoading(true);
        const correct = await getRandomPokemon();
        const incorrectOptions = [];

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">Game Over!</h1>
                <p className="text-2xl font-semibold mb-4">Your final score: {score} / {TOTAL_QUESTION}</p>   
                <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-2 px-6 rounded-lg font-bold transition duration-300"
                    onClick={restartGame}
                >
                    Play Again
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Who is That Pokémon?</h1>

            <button
                className="bg-yellow-400 text-xl py-2 px-5 rounded-md text-white"
                disabled
            >
                Time left: {timer} seconds
            </button>
            <div className="text-xl mb-8">Question {questionCount + 1} of {TOTAL_QUESTION}</div>

            {correctPokemon && (
                <div className="mb-8 p-4 bg-white rounded-lg shadow-lg transition duration-500">
                    <img 
                        src={correctPokemon.sprites.front_default} 
                        alt={correctPokemon.name}
                        className="w-32 h-32 object-contain"
                    />
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                {options.map((option) => (
                    <button
                        key={option.name}
                        className={`py-2 px-4 rounded-lg text-white font-semibold ${
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

            {selectedAnswer && (
                <div className="mt-6 text-center">
                    {isCorrect ? (
                        <p className="text-xl text-green-600 font-semibold">🎉 Correct!</p>
                    ) : (
                        <p className="text-xl text-red-600 font-semibold">❌ Oops! The correct answer was {correctPokemon.name}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default GuessPokemonName;