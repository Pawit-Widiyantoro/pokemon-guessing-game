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

    const getRandomPokemon = async (id = Math.floor(Math.random() * 150) - 1) => {
        const response = await fetch(`http://pokeapi.com/api/v2/pokemon/${id}`);
        const data = response.data;
        return data;
    };

    const generateOptions = async () => {
        setLoading(true);
        const correctOptions = getRandomPokemon();
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
        const isAnswerCorrect = selectedAnswer.sprites.front_default === correctPokemon.sprites.front_defailt;
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
        setSelectedAnswer(0);
        setQuestionCount(0);
        setIsGameOver(true);
        generateOptions();
    };

    if (loading) return <Loading message="Fetching data, please wait" />

    if (isGameOver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-4xl font-bold text-blue-600 mb-8">Game Over!</h1>
                <p className="text-2xl font-semibold mb-4">Your final score: {score} / {TOTAL_QUESTIONS}</p>   
                <button
                    className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 py-2 px-6 rounded-lg font-bold transition duration-300"
                    onClick={restartGame}
                >
                    Play Again
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">Who is That Pokémon?</h1>

            <button
                className="bg-yellow-400 text-xl py-2 px-5 rounded-md text-white"
                disabled
            >
                Time left: {timer} seconds
            </button>
            <div className="text-xl mb-8">Question {questionCount + 1} of {TOTAL_QUESTIONS}</div>

            {correctPokemon && (
                <div className="mb-8 p-4 bg-white rounded-lg shadow-lg transition duration-500">
                    <p>{correctPokemon.name}</p>
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
                        <img 
                            src={correctPokemon.sprites.front_default} 
                            alt={correctPokemon.name}
                            className="w-32 h-32 object-contain"
                        />
                    </button>
                ))}
            </div>

            {selectedAnswer && (
                <div className="mt-6 text-center">
                    {isCorrect ? (
                        <p className="text-xl text-green-600 font-semibold">🎉 Correct!</p>
                    ) : (
                        <p className="text-xl text-red-600 font-semibold">❌ Oops! The correct answer was {correctPokemon.sprites.front_default}</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default GuessPokemonImage;