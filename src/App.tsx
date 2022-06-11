import { Box, Circle, Flex } from "@chakra-ui/react";
import {
  createRef,
  useEffect,
  useMemo,
  LegacyRef,
  useState,
  useRef,
  forwardRef,
  ReactNode
} from "react";
import data from "./data";
import "./styles.css";

const colors = ["Beige", "Khaki", "DeepSkyBlue", "LightCyan"];
const selectedColor = "red";

const SpyContainer = forwardRef(
  (props: { children: ReactNode }, ref: React.Ref<HTMLDivElement>) => (
    <Box overflow="auto" w="500px" h="100%" bg="darkgray" ref={ref}>
      {props.children}
    </Box>
  )
);

const useIntercection = (elementsNumber: number) => {
  const [selectedRefIdx, setSelectedRefIdx] = useState(0);
  const refs = useMemo(
    () =>
      Array(elementsNumber)
        .fill(true)
        .map(() => createRef<HTMLElement>()),
    [elementsNumber]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const indexNumber = entry.target.getAttribute("data-index-number");

      if (entry.isIntersecting && indexNumber)
        setSelectedRefIdx(Number(indexNumber));
    }, options);

    refs.forEach((ref) => ref.current && observer.observe(ref.current));
  }, [refs]);

  const selectSection = (idx: number) => {
    const ref = refs[idx];
    ref.current?.scrollIntoView({ behavior: "smooth" });
    setSelectedRefIdx(idx);
  };

  return { refs, selectedRefIdx, containerRef, selectSection };
};

export default function App() {
  const { refs, selectedRefIdx, containerRef, selectSection } = useIntercection(
    data.length
  );

  return (
    <div className="App">
      <Flex h={700} bg="white">
        <Box bg="tomato" padding="10">
          {data.map((elem, idx) => (
            <Circle
              key={elem.id}
              mb="10"
              size="40"
              bg={selectedRefIdx === idx ? selectedColor : colors[elem.id]}
              onClick={() => selectSection(idx)}
              cursor="pointer"
              data-selected={selectedRefIdx === idx}
              data-testid="circle"
            >
              N - {elem.id}
            </Circle>
          ))}
        </Box>
        <Box p={10} flex={1} bg="cyan">
          <SpyContainer ref={containerRef}>
            {data.map((elem, idx) => (
              <Box
                id={`${idx}`}
                data-index-number={idx}
                bg={selectedRefIdx === idx ? selectedColor : colors[elem.id]}
                p={5}
                mb={15}
                shadow="md"
                borderWidth="1px"
                key={elem.id}
                ref={refs[idx] as LegacyRef<HTMLDivElement>}
              >
                <Box fontSize="20" mb="5">
                  Title {elem.id}
                </Box>
                {elem.text}
              </Box>
            ))}
          </SpyContainer>
        </Box>
      </Flex>
    </div>
  );
}
