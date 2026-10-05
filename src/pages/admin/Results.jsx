import ResultRecordingSheet from "../../components/results/ResultRecordingSheet";

function Results() {
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-green-950">
                    Results
                </h1>

                <p className="mt-2 text-gray-600">
                    Record and manage student academic results.
                </p>
            </div>

            <div className="mt-8">
                <ResultRecordingSheet />
            </div>
        </div>
    );
}

export default Results;