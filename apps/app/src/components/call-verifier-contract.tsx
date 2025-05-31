import { useEmailProofVerification } from "~/hooks/useEmailProofVerification";
import { useLocalStorage } from "usehooks-ts";

export const CallVerifierContract = () => {
  const [emlFile] = useLocalStorage("emlFile", "");

  const { startProving, verificationError } = useEmailProofVerification();

  const handleProving = () => {
    if (emlFile) {
      void startProving(emlFile);
    }
  };

  return (
    <>
      <div className="mt-5 flex justify-center">
        <button
          type="button"
          id="nextButton"
          data-testid="mint-nft-button"
          onClick={handleProving}
        ></button>
      </div>
      {verificationError && (
        <div className="mt-5 flex justify-center">
          <p className="text-red-500">{verificationError.toString()}</p>
        </div>
      )}
    </>
  );
};
