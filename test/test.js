const { assert } = require('chai');
const { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } = require('rxjs');

function clock(time, times, tickFn, doneFn) {
    let i = 0;
    const interval = setInterval(() => {
        if (i < times) {
            tickFn(i);
            i++;
        } else {
            clearInterval(interval);
            doneFn();
        }
    }, time);
}

function setup(input, output, subject, done) {
    const delay = 50; // ms
    const afterTwoTicks = 120; // ms

    clock(
        delay,
        input.length,
        (i) => subject.next(input[i]),
        () => subject.complete()
    );

    setTimeout(() => {
        subject.subscribe({
            next(v) {
                assert.equal(v, output.shift());
            },
            complete() {
                done();
            }
        });
    }, afterTwoTicks);
}

test('Subject', (done) => {
    const s = new Subject();
    const input = [1, 2, 3, 4, 5];
    const output = [3, 4, 5];
    setup(input, output, s, done);
});

// <editor-fold desc="marble">
// subject      --1--2--3--4--5|
//                    |
// subscription       --3--4--5
// </editor-fold>


test('BehaviorSubject', (done) => {
    const s = new BehaviorSubject(null);
    const input = [1, 2, 3, 4, 5];
    const output = [2, 3, 4, 5];
    setup(input, output, s, done);
});

// <editor-fold desc="marble">
// subject      --1--2--3--4--5|
//                    |
// subscription       2-3--4--5
// </editor-fold>


test('ReplaySubject', (done) => {
    const s = new ReplaySubject();
    const input = [1, 2, 3, 4, 5];
    const output = [1, 2, 3, 4, 5];
    setup(input, output, s, done);
});

// <editor-fold desc="marble">
// subject      --1--2--3--4--5|
//                    |
// subscription       123--4--5
// </editor-fold>


test('AsyncSubject', (done) => {
    const s = new AsyncSubject();
    const input = [1, 2, 3, 4, 5];
    const output = [5];
    setup(input, output, s, done);
});

// <editor-fold desc="marble">
// subject      --1--2--3--4--5|
//                    |
// subscription       --------5
// </editor-fold>
