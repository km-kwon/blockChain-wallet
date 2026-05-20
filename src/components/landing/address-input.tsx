import { FormEvent, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { isEnsName, isEthereumAddress, normalizeWalletInput } from "@/lib/format";
import { cn } from "@/lib/utils";

type ValidationState = "idle" | "valid" | "invalid";

function getValidationState(value: string): ValidationState {
  const normalized = normalizeWalletInput(value);

  if (!normalized) {
    return "idle";
  }

  return isEthereumAddress(normalized) || isEnsName(normalized) ? "valid" : "invalid";
}

function getNormalizedRouteValue(value: string) {
  const normalized = normalizeWalletInput(value);

  return isEnsName(normalized) ? normalized.toLowerCase() : normalized;
}

export default function AddressInput() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const validationState = useMemo(() => getValidationState(value), [value]);
  const showError = validationState === "invalid" || (hasSubmitted && validationState === "idle");
  const errorMessage =
    validationState === "idle"
      ? "Enter an Ethereum address or ENS name."
      : "Use a 0x address with 40 hex characters or an ENS ending in .eth.";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    if (validationState !== "valid") {
      return;
    }

    navigate(`/${encodeURIComponent(getNormalizedRouteValue(value))}`);
  }

  return (
    <form
      className="mt-8 rounded-lg border bg-white/75 p-4 text-left shadow-sm backdrop-blur dark:bg-slate-950/60"
      onSubmit={handleSubmit}
    >
      <label className="text-sm font-medium text-muted-foreground" htmlFor="wallet-address">
        Wallet address or ENS
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          aria-describedby={showError ? "wallet-address-error" : undefined}
          aria-invalid={showError}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          className={cn(
            "min-h-12 flex-1 rounded-md border bg-transparent px-4 py-3 outline-none transition placeholder:text-muted-foreground/70 focus:ring-2",
            validationState === "valid" && "border-teal-500 focus:border-teal-500 focus:ring-teal-500/20",
            validationState === "invalid" && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
            validationState === "idle" && "focus:border-accent focus:ring-accent/20",
          )}
          id="wallet-address"
          onChange={(event) => setValue(event.target.value)}
          placeholder="vitalik.eth or 0x..."
          spellCheck={false}
          type="text"
          value={value}
        />
        <button
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-5 text-sm font-medium text-accent-foreground transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-45"
          disabled={validationState !== "valid"}
          type="submit"
        >
          Explore
          <ArrowRight aria-hidden="true" className="size-4" />
        </button>
      </div>
      <p
        className={cn(
          "mt-3 min-h-5 text-sm",
          showError ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground",
        )}
        id="wallet-address-error"
        role={showError ? "alert" : undefined}
      >
        {showError ? errorMessage : " "}
      </p>
    </form>
  );
}
