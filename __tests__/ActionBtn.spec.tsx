import { act, fireEvent, render, screen, userEvent } from "@testing-library/react-native"
import ActionBtn from "../src/components/ActionBtn"

describe("<ActionBtn/>", () => {
    const fn = jest.fn()
    test("Make sure component render correctly with basic Props", () => {

        render(<ActionBtn text={"Take a Photo"} textColor={"#FFFFFF"} backgroundColor={"#000000"} onClick={fn} />)

        const btnText = screen.queryByText("Take a Photo")
        expect(btnText).toBeOnTheScreen()
        expect(btnText).toHaveStyle({ color: "#FFFFFF" })

    })

    test("Make sure onClick function is called when button is pressed", () => {
        render(<ActionBtn text={"Take a Photo"} textColor={"#FFFFFF"} backgroundColor={"#000000"} onClick={fn} />)
        const btn = screen.queryByRole('button') //as I use QueryBu => so it may return NULL

        expect(btn).toBeOnTheScreen()
        expect(btn).toHaveStyle({ backgroundColor: "#000000" })

        fireEvent.press(btn!!) //for that we use !! to tell TS that btn is NOT NULL
        //UserEvent provides realistic event simulation
        //fireEvent dispatches DOM events, whereas userEvent simulates full interactions, 
        // which may fire multiple events and do additional checks along the way.

        expect(fn).toHaveBeenCalledTimes(1)
        //Debug the current screen state
        // screen.debug()
    })

    test("Make sure the hidden text appear on Long press after 5 seconds", async () => {
        // Activate FakeTimer
        jest.useFakeTimers()

        // Now, setup UserEvent (with Advance Timer)
        const user = userEvent.setup({
            delay: undefined,
            advanceTimers: (delay) => {
                jest.advanceTimersByTime(10000)
                // "5000" refers to advance the clock to 5s and show result now.
                // "delay" refers a basic "130" milliseconds to update a STATE.
            }
        })


        render(<ActionBtn text={"Take a Photo"} textColor={"#FFFFFF"} backgroundColor={"#000000"} onClick={fn} />)
        const btn = screen.queryByRole('button')

        // Each time you will call a "UserEvent" method like below,
        // it will trigger this line "jest.advanceTimersByTime(10000)"
        await user.longPress(btn!!)

        const showedText = screen.queryByTestId("show_text")

        expect(showedText).toBeOnTheScreen()
        expect(showedText).toHaveTextContent("Hello For TEST...")
    })

    test("Make a test case to use FireEvent", async () => {
        // Activate FakeTimer
        jest.useFakeTimers()

        //render the screen
        render(<ActionBtn text={"Take a Photo"} textColor={"#FFFFFF"} backgroundColor={"#000000"} onClick={fn} />)

        //Get the BTN
        const btn = screen.queryByRole('button')

        //set action of btn
        fireEvent.press(btn!!)

        act(() => {
            jest.advanceTimersByTime(10000)
        })

        const showedText = screen.queryByTestId("show_text")

        expect(showedText).toBeOnTheScreen()

        jest.useRealTimers()
        {/*
        If you place jest.advanceTimersByTime(10000) before fireEvent.press(button), 
        you will see an error because screen.queryByTestId and expect(textConditional) 
        depend on a setTimeout state update with a delay of 5 seconds after the button 
        press inside the component below.    
        */}
    })
})

{/**
UPDATE method
screen.update(<Component/>)

it simulates if your component receives new data from an API or user interactions trigger prop updates

-----------------------------
update method perform TWO different tasks:
1- UPDATE   => if the given prop have the same key and type
2- RE-MOUNT => if the given prop have different key or type  (creates a whole new tree)


**update() with new value but without changing key will not MOUNT the component again, & it will just only update the existing DOM tree.
*/}

{/*
    userEvent => we set the fake timer advance inside the setup
    and we set TIMER before calling the action (async/await)

    fireEvent => we set the TIMER after calling the action
*/}