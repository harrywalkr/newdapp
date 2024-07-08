import clsx from 'clsx';
import React, { useEffect } from 'react';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface AnimatedListProps {
  words: string[];
  className?: string
}

const AnimatedText: React.FC<AnimatedListProps> = ({ words, className }) => {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLLIElement>('.menu ul li');

    elements.forEach((element) => {
      const animateText = () => {
        let iterations = 0;
        const originalText = element.dataset.value || "";

        const interval = setInterval(() => {
          element.innerText = originalText.split("")
            .map((letter, index) => {
              if (index < iterations) {
                return originalText[index];
              }
              return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

          if (iterations >= originalText.length) {
            clearInterval(interval);
            setTimeout(animateText, 10000); // Add 10-second delay before repeating the animation
          }

          iterations += 1 / 3; // Reset iterations to loop the animation
        }, 30);
      };

      animateText();
    });
  }, [words]);

  return (
    <div className={clsx('menu', className)}>
      <ul>
        {words.map((word) => (
          <li key={word} data-value={word}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnimatedText;
