import { createSignal, For } from "solid-js"
import styles from "./Select.module.css"
import { ChevronDown } from "lucide-solid"
import clickOutside from "~/lib/clickOutside"
false && clickOutside

type BaseProps<T, V extends string | number> = {
    list: T[];
    setSelected: (newObj: T | null) => void;
    selected: V | null;
};

type ConditionalProps<T, V extends string | number> = T extends string
    ? {
          // Optional when T is string
          getLabel?: (item: T) => string;
          getIdentifier?: (item: T) => V;
      }
    : {
          // Required when T is anything else
          getLabel: (item: T) => string;
          getIdentifier: (item: T) => V;
      };

type SelectProps<T, V extends string | number> = BaseProps<T, V> & ConditionalProps<T, V>;

export function FormSelect<T, V extends string | number>(props: SelectProps<T, V>) {
    
    const getLabel = props.getLabel ?? ((val: string) => val)
    const getValue = props.getIdentifier ?? ((val: string) => val)
    const selected = () => props.list.find(x => getValue(x) == props.selected)
    
    const [isOpen, setIsOpen] = createSignal(false)
    
    return (
        <div
            use:clickOutside={() => setIsOpen(false)}
            role="listbox"
            tabIndex={2}
            class={styles.select}
            onkeypress={e => e.preventDefault}
        >
            <div
                class={styles.header}
                onclick={() => setIsOpen(prev => !prev)}
            >
                <span> {selected() ? getLabel(selected()!) : "Select..."} </span>
                <ChevronDown />
            </div>
            <ul class={styles.drawer} classList={{ [styles.isOpen]: isOpen() }}>
                <FormOption
                    item={null}
                    setSelected={val => {
                        setIsOpen(false);
                        props.setSelected(val)
                    }}
                    getLabel={getLabel}
                />
                <For each={props.list}>
                    {item =>
                        <FormOption
                            item={item}
                            setSelected={val => {
                                setIsOpen(false);
                                props.setSelected(val)
                            }}
                            getLabel={getLabel}
                        />
                    }
                </For>
            </ul>
        </div>
    )
}

type OptionProps<T> = {
    item: T | null
    setSelected: (item: T | null) => void
    getLabel: (item: T) => string
}

function FormOption<T>(props: OptionProps<T>) {

    return (
        <li
            role="option"
            class={styles.option}
            onclick={() => {
                props.setSelected(props.item)
            }}
            onkeypress={e => {
                if (e.key == "Enter") {
                    e.stopImmediatePropagation()
                    e.currentTarget.click()
                }
            }}
        >
            {props.item ? props.getLabel(props.item) : "<nil>"}
        </li>
    )
}