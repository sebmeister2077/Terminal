import { DependencyList, EffectCallback, useEffect } from "react";

export const useEffectWithAbort = (effect: (signal:AbortSignal)=>ReturnType<EffectCallback>, deps?: DependencyList ) => {
    
    useEffect(() => {   
        const controller = new AbortController();
        const returnedDestructor = effect(controller.signal);

        return () => {
            controller.abort();
            returnedDestructor?.();
        }

    }, deps ?? []);
}